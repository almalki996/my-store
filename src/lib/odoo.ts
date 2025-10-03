// src/lib/odoo.ts

import { cache } from 'react';

const ODOO_URL = process.env.ODOO_URL as string;
const ODOO_DB = process.env.ODOO_DB as string;
const ODOO_PASSWORD = process.env.ODOO_PASSWORD as string;

// A generic function to call any model and method in Odoo
const odooJsonRpc = async (model: string, method: string, args: unknown[] = [], kwargs: Record<string, unknown> = {}): Promise<unknown> => {
    const url = `${ODOO_URL}/jsonrpc`;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'call',
            params: {
                service: 'object',
                method: 'execute_kw',
                args: [
                    ODOO_DB,
                    2, // For simplicity, using admin user ID (2). This should be handled more securely in a real app.
                    ODOO_PASSWORD,
                    model,
                    method,
                    args,
                    kwargs,
                ],
            },
        }),
        // Use Next.js caching for performance. Data will be re-fetched every hour.
        next: { revalidate: 3600 },
    });

    if (!response.ok) {
        throw new Error(`Odoo API request failed: ${response.statusText}`);
    }

    const result = await response.json();
    if (result.error) {
        console.error('Odoo Error:', result.error);
        throw new Error(`Odoo Error: ${result.error.data?.message || result.error.message}`);
    }
    return result.result;
};

// A specific function to get published products, wrapped in React's cache for performance
export const getProducts = cache(async () => {
    try {
        const products = await odooJsonRpc(
            'product.template',
            'search_read',
            // This filter is more robust for production
            [[['public_categ_ids', '!=', false], ['is_published', '=', true]]],
            { fields: ['id', 'name', 'list_price', 'image_1024', 'public_categ_ids'] }
        );
        return products;
    } catch (error) {
        console.error("Could not fetch products:", error);
        return [];
    }
});

// A specific function to get a single product by its ID
export const getProductById = cache(async (id: number) => {
    try {
        const product = await odooJsonRpc(
            'product.template',
            'search_read',
            [[['id', '=', id]]],
            { fields: ['id', 'name', 'list_price', 'image_1920', 'description_sale'] } // Added description_sale
        ) as Array<{ id: number; name: string; list_price: number; image_1920?: string; description_sale?: string }>;
        return product[0] || null; // Return the first product or null if not found
    } catch (error) {
        console.error(`Could not fetch product with id ${id}:`, error);
        return null; // Return null on error
    }
});

export const getCategories = cache(async () => {
    try {
        // 'product.public.category' is the model for eCommerce categories
        const categories = await odooJsonRpc(
            'product.public.category',
            'search_read',
            [], // Fetch all categories
            { fields: ['id', 'name'] }
        );
        return categories;
    } catch (error) {
        console.error("Could not fetch categories:", error);
        return [];
    }
});


export const getProductsByCategory = cache(async (categoryId: number) => {
    try {
        const products = await odooJsonRpc(
            'product.template',
            'search_read',
            [[['public_categ_ids', 'child_of', categoryId], ['is_published', '=', true]]],
            { fields: ['id', 'name', 'list_price', 'image_1024', 'public_categ_ids'] }
        );
        return products;
    } catch (error) {
        console.error(`Could not fetch products for category ${categoryId}:`, error);
        return [];
    }
});

export const searchProducts = cache(async (query: string) => {
    try {
        const products = await odooJsonRpc(
            'product.template',
            'search_read',
            [[['name', 'ilike', query], ['is_published', '=', true]]], // 'ilike' for case-insensitive search
            { fields: ['id', 'name', 'list_price', 'image_1024'] }
        );
        return products;
    } catch (error) {
        console.error(`Could not search for products with query "${query}":`, error);
        return [];
    }
});

interface CustomerData {
    name: string;
    email: string;
    address: string;
}

interface CartItem {
    id: number;
    quantity: number;
}

export const createSalesOrder = async (customer: CustomerData, cartItems: CartItem[]) => {
    try {
        // Step 1: Find or create the customer (partner)
        const partnerSearchResult = await odooJsonRpc('res.partner', 'search', [[['email', '=', customer.email]]], { limit: 1 }) as number[];
        let partnerId: number;

        if (!partnerSearchResult || partnerSearchResult.length === 0) {
            // If partner does not exist, create a new one
            partnerId = await odooJsonRpc('res.partner', 'create', [{
                name: customer.name,
                email: customer.email,
                street: customer.address,
            }]) as number;
        } else {
            partnerId = partnerSearchResult[0]; // Use the ID from the search result
        }

        // Step 2: Prepare order lines from cart items
        const orderLines = cartItems.map(item => [0, 0, {
            product_id: item.id,
            product_uom_qty: item.quantity,
        }]);

        // Step 3: Create the sales order
        const orderId = await odooJsonRpc('sale.order', 'create', [{
            partner_id: partnerId,
            order_line: orderLines,
        }]);

        // Optional: You can confirm the sales order to turn it into a real order
        // await odooJsonRpc('sale.order', 'action_confirm', [orderId]);

        return { success: true, orderId: orderId };

    } catch (error) {
        console.error("Failed to create sales order:", error);
        return { success: false, error: (error as Error).message };
    }
};

// This function checks user credentials against Odoo's authentication endpoint
export const authenticateUser = async (email: string, password: string) => {
    const url = `${process.env.ODOO_URL}/jsonrpc`;
    const db = process.env.ODOO_DB;

    try {
        // Step 1: Authenticate and get UID
        const uidResponse = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'call',
                params: {
                    service: 'common',
                    method: 'authenticate',
                    args: [db, email, password, {}],
                },
            }),
        });

        const uidResult = await uidResponse.json();

        if (uidResult.error || !uidResult.result) {
            console.error("Odoo Authentication failed:", uidResult.error);
            return null; // Invalid credentials
        }

        const uid = uidResult.result;

        // Step 2: Fetch user details using the UID
        const userDetails = await odooJsonRpc(
            'res.users',
            'search_read',
            [[['id', '=', uid]]],
            { fields: ['id', 'name', 'email'] }
        ) as Array<{ id: number; name: string; email: string }>;

        if (!userDetails || userDetails.length === 0) {
            return null;
        }

        return userDetails[0]; // Return user object { id, name, email }

    } catch (error) {
        console.error("Error during Odoo authentication:", error);
        return null;
    }
};


export const createUser = async (name: string, email: string, password: string) => {
    try {
        const portalGroupId = await odooJsonRpc('ir.model.data', 'search_read',
            [[['module', '=', 'base'], ['name', '=', 'group_portal']]],
            { fields: ['res_id'] }
        ) as { res_id: number }[];

        if (!portalGroupId || portalGroupId.length === 0) {
            throw new Error("Portal user group not found in Odoo.");
        }
        const groupId = portalGroupId[0].res_id;

        const userId = await odooJsonRpc('res.users', 'create', [{
            name: name,
            login: email,
            email: email,
            password: password,
            groups_id: [[4, groupId]] 
        }]);

        if (!userId) { throw new Error("Failed to create user in Odoo."); }
        return { success: true, userId };

    } catch (error) {
        console.error("Failed to create user in Odoo:", error);
        const errorMessage = (error as any).message?.includes("already exists") 
            ? "هذا البريد الإلكتروني مسجل مسبقًا."
            : "فشل إنشاء المستخدم في Odoo.";
        return { success: false, error: errorMessage };
    }
};
