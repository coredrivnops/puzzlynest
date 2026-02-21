'use client';

import Link from 'next/link';

interface BreadcrumbItem {
    label: string;
    href?: string; // omit for the last (current) item
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav
            aria-label="Breadcrumb"
            style={{ marginBottom: '1rem' }}
        >
            <ol
                itemScope
                itemType="https://schema.org/BreadcrumbList"
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '0.25rem',
                    listStyle: 'none',
                    margin: 0,
                    padding: '0.6rem 0',
                    fontSize: '0.85rem',
                }}
            >
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    return (
                        <li
                            key={index}
                            itemScope
                            itemProp="itemListElement"
                            itemType="https://schema.org/ListItem"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                            {item.href && !isLast ? (
                                <Link
                                    href={item.href}
                                    itemProp="item"
                                    style={{
                                        color: 'rgba(255,255,255,0.5)',
                                        textDecoration: 'none',
                                        transition: 'color 0.2s',
                                        fontWeight: 500,
                                    }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.85)'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}
                                    aria-label={item.label}
                                >
                                    <span itemProp="name">{item.label}</span>
                                </Link>
                            ) : (
                                <span
                                    itemProp="name"
                                    aria-current={isLast ? 'page' : undefined}
                                    style={{
                                        color: isLast ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)',
                                        fontWeight: isLast ? 600 : 400,
                                    }}
                                >
                                    {item.label}
                                </span>
                            )}
                            <meta itemProp="position" content={String(index + 1)} />

                            {/* Chevron separator — hidden on last item */}
                            {!isLast && (
                                <span
                                    aria-hidden="true"
                                    style={{
                                        color: 'rgba(255,255,255,0.25)',
                                        fontSize: '0.75rem',
                                        marginLeft: '0.1rem',
                                    }}
                                >
                                    ›
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
