import Link from 'next/link';
import { ThemeControl } from '@/shared/theme';
import { serializeJsonLd, SITE_URL } from '@/shared/seo';
import { styles as s } from './guide.styles';
const QUESTIONS = [
  {
    question: 'What is Transit Desk?',
    answer:
      'Transit Desk is an independent fleet monitoring dashboard built for a frontend technical assessment. It displays vehicle positions and journey information from the Massachusetts Bay Transportation Authority (MBTA) in Greater Boston. It is not an official MBTA or Transjakarta service.',
  },
  {
    question: 'How often does the vehicle data update?',
    answer:
      'The dashboard requests a fresh fleet snapshot every 30 seconds while the page is active. You can also select Refresh feed. Each vehicle shows the timestamp provided by MBTA, which may be older than the dashboard sync time. All displayed times use America/New_York (Eastern Time).',
  },
  {
    question: 'How do route and trip filters work together?',
    answer:
      'You can select multiple routes and multiple trips. Matches within each filter are combined with OR; routes and trips are combined with AND. Changing the route selection clears the selected trips and returns to page one. Scheduled trips without reporting vehicles can produce an empty result.',
  },
  {
    question: 'Why are some routes or trips not visible in the dropdown?',
    answer:
      'Options load in batches of 25 when you open and scroll the dropdown. You can also use Load more. Search checks only the options already loaded; load more batches to search additional options. Trip options are scoped to your selected routes.',
  },
  {
    question: 'What do the vehicle statuses mean?',
    answer:
      'In transit (IN_TRANSIT_TO) means the vehicle is travelling toward the next stop. At stop (STOPPED_AT) means it is at a stop. Arriving (INCOMING_AT) means it is approaching a stop. These are vehicle positions relative to stops, not measures of punctuality.',
  },
  {
    question: 'How does pagination work?',
    answer:
      'The dashboard filters the complete fetched vehicle snapshot, then divides the matching records into pages of 6, 12, or 24. It displays the current data range, total matching vehicles, and total pages. Filters and page-size changes return to page one.',
  },
  {
    question: 'What happens if the transit feed is unavailable?',
    answer:
      'Transit Desk displays a clear error and a retry action. If a previous successful snapshot exists, it remains visible and is labelled as the last available snapshot. Missing coordinates are shown as unavailable, and the map is omitted for that vehicle.',
  },
];
export function GuidePage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FAQPage',
        '@id': `${SITE_URL}/guide#faq`,
        mainEntity: QUESTIONS.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Fleet overview', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Field guide', item: `${SITE_URL}/guide` },
        ],
      },
    ],
  };
  return (
    <div className={s.shell}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
      />
      <header className={s.header}>
        <nav className={s.nav} aria-label="Main navigation">
          <Link href="/" className={s.brand}>
            transit<span className={s.accent}>desk</span>
          </Link>
          <ThemeControl />
          <Link href="/" className={s.back}>
            Back to fleet ↗
          </Link>
        </nav>
      </header>
      <main id="main-content" className={s.main}>
        <div className={s.hero}>
          <div>
            <p className={s.eyebrow}>The Transit Desk field guide / 01</p>
            <h1 className={s.title}>
              Read the feed.
              <br />
              Know its limits<span className={s.accent}>.</span>
            </h1>
          </div>
          <p className={s.intro}>
            A moving dot tells part of the story. Here is what the MBTA reports, how to narrow your
            search, and when a timestamp deserves a second look.
          </p>
        </div>
        <div className={s.layout}>
          <aside className={s.aside}>
            <nav className={s.asideInner} aria-label="Guide sections">
              <a className={s.anchor} href="#getting-started">
                01 / Getting started
              </a>
              <a className={s.anchor} href="#status-reference">
                02 / Reading the feed
              </a>
              <a className={s.anchor} href="#questions">
                03 / Common questions
              </a>
              <a className={s.anchor} href="#sources">
                04 / Sources & scope
              </a>
            </nav>
          </aside>
          <div className={s.body}>
            <section id="getting-started" className={s.section}>
              <h2 className={s.heading}>Start with a number or a destination.</h2>
              <p className={s.text}>
                Transit Desk brings the MBTA vehicle feed into one searchable view. Start with the
                network, narrow your focus, and inspect an individual journey.
              </p>
              <div className={s.steps}>
                {[
                  {
                    title: 'Find your fleet',
                    text: 'Search a vehicle label, route, or destination. The summary always describes the full fetched network.',
                  },
                  {
                    title: 'Narrow the view',
                    text: 'Choose multiple routes and trips, or filter by status. Your result count and pages update together.',
                  },
                  {
                    title: 'Follow the details',
                    text: 'Open a vehicle card to see its map position, route, trip, direction, and last reported update.',
                  },
                ].map((step, index) => (
                  <div className={s.step} key={step.title}>
                    <p className={s.number}>0{index + 1}</p>
                    <h3 className={s.stepTitle}>{step.title}</h3>
                    <p className={s.stepText}>{step.text}</p>
                  </div>
                ))}
              </div>
            </section>
            <section id="status-reference" className={s.section}>
              <h2 className={s.heading}>Read a status as a position.</h2>
              <table className={s.table}>
                <caption className={s.text}>Vehicle status reference</caption>
                <thead>
                  <tr>
                    <th className={s.th} scope="col">
                      Status
                    </th>
                    <th className={s.th} scope="col">
                      API value
                    </th>
                    <th className={s.th} scope="col">
                      Meaning
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['In transit', 'IN_TRANSIT_TO', 'Travelling toward the next stop'],
                    ['At stop', 'STOPPED_AT', 'Currently at a stop'],
                    ['Arriving', 'INCOMING_AT', 'Approaching a stop'],
                  ].map((row) => (
                    <tr key={row[1]}>
                      <th className={s.td} scope="row">
                        {row[0]}
                      </th>
                      <td className={s.td}>
                        <code className={s.code}>{row[1]}</code>
                      </td>
                      <td className={s.td}>{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
            <section id="questions" className={s.section}>
              <h2 className={s.heading}>Before you rely on that dot.</h2>
              <div className={s.faq}>
                {QUESTIONS.map((item) => (
                  <details key={item.question}>
                    <summary className={s.question}>{item.question}</summary>
                    <p className={s.answer}>{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>
            <section id="sources" className={s.section}>
              <h2 className={s.heading}>The source is MBTA. The desk is independent.</h2>
              <p className={s.text}>
                Vehicle positions, routes, and trips come from the public MBTA V3 API. Map tiles and
                geographic context come from OpenStreetMap. This dashboard is an independent
                assessment project inspired by a Transjakarta frontend brief; its live data
                represents Greater Boston, not Jakarta.
              </p>
              <ul className={s.sourceList}>
                <li>
                  <a className={s.link} href="https://api-v3.mbta.com/docs/swagger/index.html">
                    MBTA V3 API reference ↗
                  </a>
                </li>
                <li>
                  <a className={s.link} href="https://www.mbta.com/developers/v3-api">
                    MBTA developer documentation ↗
                  </a>
                </li>
                <li>
                  <a className={s.link} href="https://www.openstreetmap.org/copyright">
                    OpenStreetMap attribution and license ↗
                  </a>
                </li>
              </ul>
            </section>
          </div>
        </div>
        <footer className={s.footer}>
          <span>Transit Desk / Independent fleet monitoring</span>
          <Link href="/" className={s.link}>
            Explore the fleet ↗
          </Link>
        </footer>
      </main>
    </div>
  );
}
