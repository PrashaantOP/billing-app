import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Check, Gem, Zap } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Plans', href: '/plans' }];

type Plan = {
    id: number;
    name: string;
    description: string;
    monthly_price: number;
    yearly_price: number;
    max_restaurants: number;
    max_users_per_restaurant: number;
    max_menu_items: number | null;
    max_orders_per_month: number;
    is_active: boolean;
};

type Subscription = { plan_name: string; status: string; is_pro: boolean };

function formatPrice(amount: number) {
    return `₹${Number(amount).toLocaleString('en-IN')}`;
}

export default function PlansPage() {
    const { plans, subscription } = usePage<{ plans: Plan[]; subscription: Subscription }>().props;
    const currentPlan = subscription?.plan_name ?? 'Free Plan';
    const isPro = subscription?.is_pro ?? false;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Plans & Pricing" />

            <div className="mx-auto max-w-5xl px-4 py-10">
                {/* Header */}
                <div className="mb-10 text-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-600 dark:bg-red-900/30 dark:text-red-400">
                        <Gem className="h-3.5 w-3.5" /> Pricing
                    </span>
                    <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-neutral-50 sm:text-5xl">
                        Choose the right plan
                    </h1>
                    <p className="mt-4 text-lg text-gray-500 dark:text-neutral-400">
                        Packed with everything you need to run your restaurant efficiently.
                    </p>
                    <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                        <span className={`h-2 w-2 rounded-full ${isPro ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <span className="text-gray-600 dark:text-neutral-400">
                            Current plan: <strong className="text-gray-900 dark:text-neutral-100">{currentPlan}</strong>
                        </span>
                    </div>
                </div>

                {/* Plan cards */}
                <div className={`grid gap-6 ${plans.length <= 1 ? 'max-w-sm mx-auto' : plans.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
                    {plans.map((plan, idx) => {
                        const isCurrent = plan.name === currentPlan;
                        const isFeatured = plans.length > 1 && idx === Math.floor(plans.length / 2);
                        const price = plan.monthly_price > 0 ? plan.monthly_price : plan.yearly_price;
                        const cycle = plan.monthly_price > 0 ? 'month' : 'year';

                        const features = [
                            `${plan.max_restaurants} restaurant${plan.max_restaurants !== 1 ? 's' : ''}`,
                            `Up to ${plan.max_users_per_restaurant} staff per restaurant`,
                            plan.max_menu_items ? `${plan.max_menu_items} menu items` : 'Unlimited menu items',
                            `${plan.max_orders_per_month.toLocaleString('en-IN')} orders/month`,
                            'Customer management',
                            'Order & payment tracking',
                            'KOT & invoice printing',
                            'GST reports & Excel export',
                        ];

                        return (
                            <div
                                key={plan.id}
                                className={[
                                    'relative flex flex-col rounded-2xl border p-8 transition-shadow',
                                    isFeatured
                                        ? 'border-red-500 bg-gray-900 shadow-2xl shadow-red-500/20 dark:bg-neutral-900'
                                        : 'border-gray-200 bg-white shadow-sm hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900',
                                ].join(' ')}
                            >
                                {isFeatured && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-red-600 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow">
                                        Most Popular
                                    </span>
                                )}
                                {isCurrent && (
                                    <span className="absolute right-4 top-4 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-400">
                                        Active
                                    </span>
                                )}

                                <div className="mb-6">
                                    <h2 className={`text-lg font-bold ${isFeatured ? 'text-red-400' : 'text-red-600 dark:text-red-400'}`}>
                                        {plan.name}
                                    </h2>
                                    <div className="mt-3 flex items-baseline gap-1">
                                        <span className={`text-4xl font-bold tracking-tight ${isFeatured ? 'text-white' : 'text-gray-900 dark:text-neutral-50'}`}>
                                            {formatPrice(price)}
                                        </span>
                                        <span className={`text-sm ${isFeatured ? 'text-gray-400' : 'text-gray-500'}`}>/{cycle}</span>
                                    </div>
                                    {plan.description && (
                                        <p className={`mt-2 text-sm ${isFeatured ? 'text-gray-400' : 'text-gray-500 dark:text-neutral-400'}`}>
                                            {plan.description}
                                        </p>
                                    )}
                                </div>

                                <ul className="mb-8 flex-1 space-y-3">
                                    {features.map(f => (
                                        <li key={f} className="flex items-start gap-2.5 text-sm">
                                            <Check className={`mt-0.5 h-4 w-4 shrink-0 ${isFeatured ? 'text-red-400' : 'text-red-600 dark:text-red-400'}`} />
                                            <span className={isFeatured ? 'text-gray-300' : 'text-gray-600 dark:text-neutral-300'}>{f}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    disabled={isCurrent}
                                    className={[
                                        'flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all focus:outline-none',
                                        isCurrent
                                            ? 'cursor-default bg-gray-100 text-gray-400 dark:bg-neutral-800 dark:text-neutral-500'
                                            : isFeatured
                                            ? 'bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-500/30'
                                            : 'border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20',
                                    ].join(' ')}
                                >
                                    {isCurrent ? 'Active Plan' : <><Zap className="h-4 w-4" /> Upgrade to {plan.name}</>}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Free plan notice if already on free */}
                {!isPro && (
                    <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-center dark:border-amber-800 dark:bg-amber-900/20">
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                            You are on the <strong>Free Plan</strong>. Upgrade to unlock more restaurants, staff, and order capacity.
                        </p>
                    </div>
                )}

                {/* Contact CTA */}
                <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center dark:border-neutral-700 dark:bg-neutral-800/50">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-100">Need a custom plan?</h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
                        Running multiple brands or a large chain? Get in touch for an enterprise quote.
                    </p>
                    <a
                        href="mailto:support@example.com"
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
                    >
                        Contact Sales
                    </a>
                </div>
            </div>
        </AppLayout>
    );
}
