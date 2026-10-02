import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description: "Accessibility standards, keyboard navigability, and WCAG AA compliance for ACM BIT Mesra website.",
};

export default function AccessibilityPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <span className="font-mono text-xs uppercase tracking-wider text-primary">Institutional</span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Accessibility Statement</h1>
        <p className="text-sm font-mono text-muted-foreground">WCAG 2.1 Level AA Commitment</p>
      </div>

      <div className="mt-8 space-y-6 text-sm sm:text-base text-muted-foreground leading-relaxed">
        <p>
          ACM BIT Mesra is dedicated to ensuring digital accessibility for people of all abilities. We continually improve the user experience for everyone and apply relevant accessibility standards.
        </p>
        <h2 className="text-xl font-semibold text-foreground pt-4">Conformance Status</h2>
        <p>
          The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA. This website targets and satisfies <strong>WCAG 2.1 Level AA</strong> requirements.
        </p>
        <h2 className="text-xl font-semibold text-foreground pt-4">Accessibility Features</h2>
        <ul className="list-disc list-inside space-y-2 pl-2">
          <li><strong>Keyboard Navigation:</strong> All interactive elements, navigation links, modals, and buttons are fully navigable via standard keyboard inputs (Tab, Shift+Tab, Enter, Space, Escape).</li>
          <li><strong>Focus Indicators:</strong> Explicit, high-contrast focus rings for all focusable controls.</li>
          <li><strong>Semantic HTML:</strong> Proper structural landmarks (<code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">&lt;header&gt;</code>, <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">&lt;main&gt;</code>, <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">&lt;footer&gt;</code>, <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">&lt;nav&gt;</code>) and hierarchical headings.</li>
          <li><strong>Reduced Motion:</strong> Respects the <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">prefers-reduced-motion</code> operating system setting to minimize animation distractions.</li>
          <li><strong>Color Contrast:</strong> Minimum 4.5:1 text-to-background contrast ratio across light and dark tokens.</li>
        </ul>
        <h2 className="text-xl font-semibold text-foreground pt-4">Feedback & Assistance</h2>
        <p>
          We welcome your feedback on the accessibility of the ACM BIT Mesra website. If you encounter accessibility barriers, please contact us at <a href="mailto:acm@bitmesra.ac.in" className="text-primary hover:underline">acm@bitmesra.ac.in</a> or submit an issue on our <a href="https://github.com/acm-bitmesra/acm-bitmesra.github.io/issues" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub repository</a>.
        </p>
      </div>
    </div>
  );
}
