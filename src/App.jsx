import { useCallback, useMemo, useState } from 'react'
import data from './data/venue.json'
import { buildBookingUrl, parseOfferItems, useRoute } from './lib/router.js'

import TopBar from './components/TopBar.jsx'
import StickyNav from './components/StickyNav.jsx'
import Breadcrumbs from './components/Breadcrumbs.jsx'
import VenueHeader from './components/VenueHeader.jsx'
import Gallery, { GalleryModal } from './components/Gallery.jsx'
import Services from './components/Services.jsx'
import Team from './components/Team.jsx'
import Reviews from './components/Reviews.jsx'
import Portfolio from './components/Portfolio.jsx'
import About from './components/About.jsx'
import BookingSidebar, { MobileBookingBar } from './components/BookingSidebar.jsx'
import NearbyVenues from './components/NearbyVenues.jsx'
import SeoLinks from './components/SeoLinks.jsx'
import Footer from './components/Footer.jsx'
import BookingFlow from './booking/BookingFlow.jsx'

/** Page shell — 1440 max width, 32px gutters, 884 / 40 / 452 split. */
const Page = ({ className = '', children }) => (
  <div className={`mx-auto max-w-page px-[var(--page-gutter)] ${className}`}>{children}</div>
)

export default function App() {
  const { path, search, isBooking, navigate } = useRoute()
  const [galleryAt, setGalleryAt] = useState(null)

  const basePath = useMemo(() => path.replace(/\/booking\/?$/, '') || '/', [path])
  const initialServiceIds = useMemo(() => parseOfferItems(search), [search])

  const openGallery = useCallback((i) => setGalleryAt(typeof i === 'number' ? i : 0), [])

  const startBooking = useCallback(
    (service) => navigate(buildBookingUrl(basePath, service ? [service.variantId] : [])),
    [basePath, navigate],
  )

  const scrollToReviews = () =>
    document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' })

  const share = async () => {
    const payload = { title: data.venue.name, text: data.venue.shareLabel, url: window.location.href }
    if (navigator.share) {
      try {
        await navigator.share(payload)
        return
      } catch {
        /* user dismissed the sheet */
      }
    }
    navigator.clipboard?.writeText(window.location.href)
  }

  if (isBooking) {
    return (
      <BookingFlow
        data={data}
        initialServiceIds={initialServiceIds}
        onExit={() => navigate(basePath)}
      />
    )
  }

  return (
    <>
      <TopBar />
      <StickyNav />

      <main className="pb-24 laptop:pb-0">
        <Page className="pt-4">
          <Breadcrumbs items={data.breadcrumbs} />
          <VenueHeader
            venue={data.venue}
            address={data.address}
            workingTime={data.workingTime}
            onRatingClick={scrollToReviews}
            onShare={share}
          />
        </Page>

        <Page className="mt-6">
          <Gallery
            gallery={data.gallery}
            venueName={data.venue.name}
            onOpen={openGallery}
            onShare={share}
          />
        </Page>

        <Page className="flex items-start gap-10">
          <div className="mt-8 flex min-w-0 flex-1 flex-col gap-12 laptop:mt-16 laptop:max-w-[884px] laptop:gap-16">
            <Services
              categories={data.serviceCategories}
              serviceCount={data.venue.serviceCount}
              onBook={startBooking}
            />
            <Team team={data.team} onSelect={() => startBooking(null)} />
            <Reviews reviews={data.reviews} venue={data.venue} />
            <Portfolio portfolio={data.portfolio} venueName={data.venue.name} />
            <About
              venue={data.venue}
              address={data.address}
              workingTime={data.workingTime}
              features={data.features}
            />
          </div>

          <BookingSidebar
            venue={data.venue}
            address={data.address}
            workingTime={data.workingTime}
            onBook={() => startBooking(null)}
            onRatingClick={scrollToReviews}
          />
        </Page>

        <div className="mt-20">
          <NearbyVenues venues={data.nearby} />
        </div>

        <SeoLinks groups={data.relatedLandingPages} />
      </main>

      <Footer />
      <MobileBookingBar venue={data.venue} onBook={() => startBooking(null)} />

      {galleryAt !== null && (
        <GalleryModal
          images={data.gallery.full}
          startIndex={galleryAt}
          venueName={data.venue.name}
          onClose={() => setGalleryAt(null)}
        />
      )}
    </>
  )
}
