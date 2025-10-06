import { Head, Link, usePage } from '@inertiajs/react';
import { Check, TrendingUp, ShieldCheck, Users, BarChart, CheckIcon } from 'lucide-react';

const features = [
  {
    title: "Superfast GST Billing",
    icon: <TrendingUp size={28} className="text-red-500" />,
    desc: "Create invoices and bills in seconds, download as PDF, and share directly on WhatsApp.",
  },
  {
    title: "Team & Role Management",
    icon: <Users size={28} className="text-red-500" />,
    desc: "Add unlimited staff and assign custom permissions. Perfect for growing businesses.",
  },
  {
    title: "Powerful Reports",
    icon: <BarChart size={28} className="text-red-500" />,
    desc: "Get real-time analytics – sales, stock, GST, profits, and more. All in one dashboard.",
  },
  {
    title: "Secure & Cloud Based",
    icon: <ShieldCheck size={28} className="text-red-500" />,
    desc: "100% cloud: Encrypted, always on, regular backups. Access your data anywhere, anytime.",
  },
];

const tiers = [
  {
    name: 'Free',
    id: 'tier-hobby',
    href: '#',
    priceMonthly: '₹0',
    description: "The perfect plan if you're just getting started with our product.",
    features: ['25 products', 'Up to 10,000 subscribers', 'Advanced analytics', '24-hour support response time'],
    featured: false,
  },
  {
    name: 'Primium',
    id: 'tier-enterprise',
    href: '#',
    priceMonthly: '₹249',
    description: 'Dedicated support and infrastructure for your company.',
    features: [
      'Unlimited products',
      'Unlimited subscribers',
      'Advanced analytics',
      'Dedicated support representative',
      'Marketing automations',
      'Custom integrations',
    ],
    featured: true,
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Landing() {
  const { auth } = usePage().props;

  return (
    <>
      <Head title="Billify - India’s Best Red Billing App" />
      <div className="relative flex min-h-screen flex-col bg-white dark:bg-neutral-950">

        {/* Red gradient polygon bg */}
        <div aria-hidden="true" className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl">
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff6b6b] to-[#f06595] opacity-30"
        />
      </div>

        {/* Navigation + Hero */}
        <header className="w-full py-6 px-3 max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-black tracking-tight text-red-600">
            <img src="/assets/images/logos/biglogopng.png" alt="" className='w-10 h-10' />
            Billify
          </div>
          <nav className="flex gap-3">
            {auth?.user ? (
              <Link
                href={route('dashboard')}
                className="rounded-lg px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold shadow transition"
              >Dashboard</Link>
            ) : (
              <>
                <Link
                  href={route('login')}
                  className="rounded-lg px-5 py-2 font-semibold text-red-700 border border-red-200 hover:bg-red-50 transition"
                >Login</Link>
                <Link
                  href={route('register')}
                  className="rounded-lg px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold shadow transition"
                >Start Free</Link>
              </>
            )}
          </nav>
        </header>

        {/* Hero */}
        <section className="flex flex-col items-center justify-center text-center px-3 py-10 md:py-20 max-w-3xl mx-auto">
          <h1 className="font-black text-4xl sm:text-5xl md:text-6xl mb-3 text-balance">
            <span className="text-red-600">Supercharge</span> Your Billing<br className="hidden md:inline" />
            <span className="text-gray-800 dark:text-white">with India's No. 1 Billing App</span>
          </h1>
          <p className="mt-5 text-lg sm:text-2xl md:text-xl text-gray-600 dark:text-gray-200 font-medium">
            All-in-one GST invoicing, inventory, staff and analytics. Trusted by thousands of retail, restaurant and service businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-8 mb-2 justify-center">
            <Link href={route(auth?.user ? 'dashboard' : 'register')}
              className="rounded-xl px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-lg shadow-md transition"
            >{auth?.user ? "Go To Dashboard" : "Get Started Free"}</Link>
            {!auth?.user && (
              <Link
                href={route('login')}
                className="rounded-xl px-6 py-3 font-semibold border-2 border-red-200 text-red-600 bg-white hover:bg-red-50 transition"
              >
                Login
              </Link>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 my-12 px-3">
          {features.map((feat, idx) => (
            <div
              className="rounded-xl border border-red-100 dark:border-neutral-800 shadow bg-white/80 dark:bg-neutral-900 p-6 flex flex-col items-center gap-3 hover:shadow-lg hover:-translate-y-1 group transition-all"
              key={feat.title}
            >
              <span>{feat.icon}</span>
              <span className="font-bold text-lg text-gray-700 dark:text-white">{feat.title}</span>
              <span className="text-sm text-gray-500 dark:text-gray-300">{feat.desc}</span>
            </div>
          ))}
        </section>

        {/* Pricing/plans - perfectly same card style */}
        <section
          className="relative isolate bg-white px-6 py-16 sm:py-20 lg:px-8"
          style={{ boxShadow: '0 4px 48px -12px #ff6b6b22' }}
        >
          <div className="mx-auto max-w-4xl text-center mb-6">
            <h2 className="text-sm font-bold text-red-600 uppercase tracking-wide mb-2">
              Flexible Pricing
            </h2>
            <p className="mb-2 text-3xl font-bold text-balance text-gray-900 dark:text-red-200 sm:text-4xl">
              Choose the right plan for you
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-center text-lg text-gray-600 dark:text-gray-300">
              Affordable plans with all the features to help your business grow.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        {tiers.map((tier, tierIdx) => (
          <div
            key={tier.id}
            className={classNames(
              tier.featured ? 'relative bg-gray-900 shadow-2xl' : 'bg-white/60 sm:mx-8 lg:mx-0',
              tier.featured
                ? ''
                : tierIdx === 0
                  ? 'rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl'
                  : 'sm:rounded-t-none lg:rounded-tr-3xl lg:rounded-bl-none',
              'rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10',
            )}
          >
            <h3
              id={tier.id}
              className={classNames(tier.featured ? 'text-red-400' : 'text-red-600', 'text-base/7 font-semibold')}
            >
              {tier.name}
            </h3>
            <p className="mt-4 flex items-baseline gap-x-2">
              <span
                className={classNames(
                  tier.featured ? 'text-white' : 'text-gray-900',
                  'text-5xl font-semibold tracking-tight',
                )}
              >
                {tier.priceMonthly}
              </span>
              <span className={classNames(tier.featured ? 'text-gray-400' : 'text-gray-500', 'text-base')}>/month</span>
            </p>
            <p className={classNames(tier.featured ? 'text-gray-300' : 'text-gray-600', 'mt-6 text-base/7')}>
              {tier.description}
            </p>
            <ul
              role="list"
              className={classNames(
                tier.featured ? 'text-gray-300' : 'text-gray-600',
                'mt-8 space-y-3 text-sm/6 sm:mt-10',
              )}
            >
              {tier.features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon
                    aria-hidden="true"
                    className={classNames(tier.featured ? 'text-red-400' : 'text-red-600', 'h-6 w-5 flex-none')}
                  />
                  {feature}
                </li>
              ))}
            </ul>
            <a
              href={tier.href}
              aria-describedby={tier.id}
              className={classNames(
                tier.featured
                  ? 'bg-red-500 text-white shadow-xs hover:bg-red-400 focus-visible:outline-red-500'
                  : 'text-red-600 ring-1 ring-red-200 ring-inset hover:ring-red-300 focus-visible:outline-red-600',
                'mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10',
              )}
            >
              Get started today
            </a>
          </div>
        ))}
      </div>
        </section>

        {/* Footer */}
        <footer className="py-8 text-center text-xs text-gray-600 dark:text-gray-400 border-t border-red-100 dark:border-red-800 bg-white/70 dark:bg-neutral-950/80">
          <div className="max-w-4xl mx-auto flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-3">
            <span>&copy; {new Date().getFullYear()} Billify. All rights reserved.</span>
            <span>
              <Link href="/privacy" className="hover:underline mr-3">Privacy Policy</Link>
              <Link href="/contact" className="hover:underline">Contact</Link>
            </span>
          </div>
        </footer>
      </div>
    </>
  );
}
