// app/design-system/page.tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DesignSystemPage() {
  return (
    <main id="main-content" className="min-h-screen p-8 bg-nb-bg">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Header */}
        <header className="text-center space-y-4">
          <h1 className="text-6xl font-black text-nb-ink leading-tight">
            TST Coaching Design System
          </h1>
          <p className="text-xl font-medium text-nb-ink/80 max-w-2xl mx-auto">
            Neo-brutalist design system showcase with bold typography, thick borders, and chunky shadows.
          </p>
        </header>

        {/* Button Variants */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-nb-ink">Button Variants</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="success">Success</Button>
            <Button variant="warning">Warning</Button>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="xl">Extra Large</Button>
          </div>
        </section>

        {/* Card Variants */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-nb-ink">Card Variants</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <Card variant="default">
              <CardHeader>
                <CardTitle>Default Card</CardTitle>
                <CardDescription>With medium shadow</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This card demonstrates the default neo-brutalist styling with medium drop shadow.</p>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Elevated Card</CardTitle>
                <CardDescription>With large shadow</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This card has a larger shadow for more prominent display.</p>
              </CardContent>
            </Card>

            <Card variant="flat">
              <CardHeader>
                <CardTitle>Flat Card</CardTitle>
                <CardDescription>No shadow</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This card has no shadow for subtle presentation.</p>
              </CardContent>
            </Card>

          </div>
        </section>

        {/* Color Palette */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-nb-ink">Color Palette</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Red */}
            <div className="bg-nb-red p-4 border-3 border-nb-border shadow-nb-md">
              <div className="font-bold text-nb-bg">Red</div>
              <div className="text-sm text-nb-bg/90">#FF552E</div>
            </div>

            {/* Amber */}
            <div className="bg-nb-amber p-4 border-3 border-nb-border shadow-nb-md">
              <div className="font-bold text-nb-ink">Amber</div>
              <div className="text-sm text-nb-ink/70">#F7AB15</div>
            </div>

            {/* Yellow */}
            <div className="bg-nb-yellow p-4 border-3 border-nb-border shadow-nb-md">
              <div className="font-bold text-nb-ink">Yellow</div>
              <div className="text-sm text-nb-ink/70">#FED170</div>
            </div>

            {/* Lilac */}
            <div className="bg-nb-lilac p-4 border-3 border-nb-border shadow-nb-md">
              <div className="font-bold text-nb-ink">Lilac</div>
              <div className="text-sm text-nb-ink/70">#B6ACE4</div>
            </div>

            {/* Pink */}
            <div className="bg-nb-pink p-4 border-3 border-nb-border shadow-nb-md">
              <div className="font-bold text-nb-ink">Pink</div>
              <div className="text-sm text-nb-ink/70">#FFC1C6</div>
            </div>

            {/* Green */}
            <div className="bg-nb-green p-4 border-3 border-nb-border shadow-nb-md">
              <div className="font-bold text-nb-ink">Green</div>
              <div className="text-sm text-nb-ink/70">#ABCF82</div>
            </div>

            {/* Teal */}
            <div className="bg-nb-teal p-4 border-3 border-nb-border shadow-nb-md">
              <div className="font-bold text-nb-bg">Teal</div>
              <div className="text-sm text-nb-bg/90">#00BEAE</div>
            </div>

            {/* Cyan */}
            <div className="bg-nb-cyan p-4 border-3 border-nb-border shadow-nb-md">
              <div className="font-bold text-nb-bg">Cyan</div>
              <div className="text-sm text-nb-bg/90">#00AFC7</div>
            </div>
          </div>
        </section>

      </div>
    </main>
  )
}
