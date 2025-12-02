import { Metadata } from 'next';

/**
 * Base configuration for SEO metadata
 * Update these values with your production configuration
 */
export const siteConfig = {
  name: 'Funders Portal',
  description:
    'Comprehensive platform for organizations to manage funding applications, bilateral engagements, and discover new opportunities. Streamline your grant management and partnership tracking.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://fundersportal.com',
  ogImage: '/og-image.png',
  keywords: [
    'grant management',
    'funding applications',
    'bilateral engagements',
    'partnership tracking',
    'funding opportunities',
    'grant discovery',
    'nonprofit management',
    'organization funding',
    'application tracking',
    'grant portal'
  ],
  authors: [
    {
      name: 'Funders Portal Team',
      url: process.env.NEXT_PUBLIC_APP_URL || 'https://fundersportal.com'
    }
  ],
  creator: 'Funders Portal',
  applicationName: 'Funders Portal',
  category: 'Business',
  classification: 'Grant Management & Funding Platform'
};

/**
 * Default metadata configuration for the application
 */
export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  applicationName: siteConfig.applicationName,
  category: siteConfig.category,
  classification: siteConfig.classification,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@fundersportal'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/logo.svg'
  },
  manifest: '/manifest.json'
};

/**
 * Generate metadata for a specific page
 */
export function generatePageMetadata({
  title,
  description,
  path = '',
  ogImage
}: {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
}): Metadata {
  const url = `${siteConfig.url}${path}`;
  const image = ogImage || siteConfig.ogImage;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title
        }
      ],
      locale: 'en_US',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image]
    },
    alternates: {
      canonical: url
    }
  };
}

/**
 * Generate JSON-LD structured data for the organization
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.svg`,
    description: siteConfig.description,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      category: 'Grant Management Software'
    }
  };
}

/**
 * Generate JSON-LD structured data for a software application
 */
export function generateSoftwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: siteConfig.name,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: siteConfig.description,
    url: siteConfig.url,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '100'
    }
  };
}

/**
 * Generate JSON-LD breadcrumb schema
 */
export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`
    }))
  };
}
