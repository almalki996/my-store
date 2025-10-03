// src/app/sitemap.ts
import { getProducts, getCategories } from '@/lib/odoo';
import { MetadataRoute } from 'next';

const URL = 'https://www.yourdomain.com'; //  <--  استبدله بدومينك الحقيقي لاحقًا

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all products and categories to create dynamic routes
  const products = await getProducts() as Array<{ id: number; name: string }>;
  const categories = await getCategories() as Array<{ id: number; name: string }>;

  const productUrls = products.map((product: { id: number; name: string }) => ({
    url: `${URL}/product/${product.id}`,
    lastModified: new Date(),
  }));

  const categoryUrls = categories.map((category: { id: number; name: string }) => ({
    url: `${URL}/category/${category.id}`,
    lastModified: new Date(),
  }));

  return [
    { url: URL, lastModified: new Date() },
    { url: `${URL}/about`, lastModified: new Date() },
    // Add other static pages here
    ...productUrls,
    ...categoryUrls,
  ];
}