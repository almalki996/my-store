// src/app/about/page.tsx
import { Metadata } from 'next';
import styles from './about.module.css';

export const metadata: Metadata = {
  title: 'من نحن - متجري',
  description: 'تعرف على قصة متجري ورؤيتنا.',
};

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <h1 className={styles.title}>
          عن متجري
        </h1>
        <div className={styles.content}>
          <p>
            أهلاً بك في متجري، وجهتك الأولى لكل ما هو جديد ومميز في عالم التقنية. 
            لقد بدأنا رحلتنا بشغف كبير لتقديم أحدث الأجهزة الإلكترونية والإكسسوارات التي تلبي
            احتياجات عملائنا وتواكب تطلعاتهم.
          </p>
          <p>
            مهمتنا هي توفير تجربة تسوق سهلة وموثوقة، مدعومة بخدمة عملاء استثنائية ومنتجات
            عالية الجودة. نحن نؤمن بأن التكنولوجيا يجب أن تكون في متناول الجميع، ونسعى جاهدين
            لتحقيق ذلك من خلال تقديم أفضل الأسعار والعروض.
          </p>
          <h2 className={styles.sectionTitle}>رؤيتنا</h2>
          <p>
            أن نكون الخيار الرائد والمفضل للمتسوقين في المنطقة، وأن نلهم مجتمعنا بتبني 
            أحدث التقنيات التي تجعل حياتهم أفضل وأسهل.
          </p>
        </div>
      </div>
    </div>
  );
}