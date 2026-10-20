import { REGIONAL_CONFIGS, getRegionalProducts } from '@/lib/regional-data'
import RegionalLandingClient from '@/components/regional/RegionalLandingClient'

export const revalidate = 3600

export default function EuropePage() {
  const config = REGIONAL_CONFIGS.eu
  const products = getRegionalProducts('eu')

  return <RegionalLandingClient config={config} featuredProducts={products} />
}
