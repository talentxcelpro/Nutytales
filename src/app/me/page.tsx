import { REGIONAL_CONFIGS, getRegionalProducts } from '@/lib/regional-data'
import RegionalLandingClient from '@/components/regional/RegionalLandingClient'

export const revalidate = 3600

export default function MiddleEastPage() {
  const config = REGIONAL_CONFIGS.me
  const products = getRegionalProducts('me')

  return <RegionalLandingClient config={config} featuredProducts={products} />
}
