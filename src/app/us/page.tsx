import { REGIONAL_CONFIGS, getRegionalProducts } from '@/lib/regional-data'
import RegionalLandingClient from '@/components/regional/RegionalLandingClient'

export const revalidate = 3600

export default function AmericaPage() {
  const config = REGIONAL_CONFIGS.us
  const products = getRegionalProducts('us')

  return <RegionalLandingClient config={config} featuredProducts={products} />
}
