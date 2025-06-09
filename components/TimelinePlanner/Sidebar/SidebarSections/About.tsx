import React from 'react'

export default function About() {
  return (
    <div className="mt-4">
      <div className="space-y-2 text-sm text-neutral-300">
        {/* Development Status */}
        <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
          <h4 className="mb-2 text-sm font-medium text-yellow-400">⚠️ Development Status</h4>
          <p>
            The software is in early development and can contain bugs. Please open issues on the
            GitHub repository for any bugs or feature requests.
          </p>
        </div>

        {/* Support Info */}
        <div className="rounded-lg border border-orange-500/20 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 p-4">
          <h4 className="mb-2 text-sm font-medium text-orange-400/80">💝 Support Development</h4>
          <p className="mb-3">
            The Cooldown Planner is a free and ad-free tool. However, if you enjoyed it, or found it
            useful, please consider donating to help cover server costs and support future
            development!
          </p>
          <a
            href="https://buymeacoffee.com/vinter"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-yellow-500/20 px-3 py-2 text-sm font-medium text-yellow-400 transition-colors hover:bg-yellow-500/30"
          >
            ☕ Buy me a coffee
          </a>
        </div>

        {/* Developer Info */}
        <div className="space-y-1 rounded-lg bg-neutral-800/50 p-4">
          <p>
            This tool has been developed by{' '}
            <a href="https://github.com/thevinter" className="text-main/80 underline">
              vinter
            </a>
          </p>
        </div>

        {/* Roadmap */}
        <div className="rounded-lg bg-neutral-800/50 p-4">
          <h4 className="mb-3 font-medium text-gray-300">📝 Roadmap</h4>
          <p className="mb-1 text-sm">
            There is a public roadmap for the website available at the following link:
          </p>
          <a
            href="https://github.com/orgs/dreamgrove/projects/3"
            target="_blank"
            rel="noopener noreferrer"
            className="text-main/80 hover:text-main/90 text-sm underline transition-colors"
          >
            https://github.com/orgs/dreamgrove/projects/3
          </a>

          <p className="mt-1 text-sm">
            If you have any ideas for features or improvements, first check the roadmap to see if it
            has already been suggested. If it has not, feel free to open a github issue.
          </p>
          <p className="pt-2">
            You can also find the source code on the same github repository:{' '}
            <a
              href="https://github.com/dreamgrove/dreamgrove"
              target="_blank"
              rel="noopener noreferrer"
              className="text-main/80 underline transition-colors hover:text-orange-300/90"
            >
              https://github.com/dreamgrove/dreamgrove
            </a>
          </p>
        </div>

        {/* Contact Info */}
        <div className="rounded-lg bg-neutral-800/50 p-4">
          <h4 className="mb-2 text-sm font-medium text-white">Contact Me</h4>
          <p>
            GitHub is the preferred way to discuss topics related to the website. If you're unable
            to use GitHub or have something that needs to be discussed privately, you can find me as{' '}
            <span className="text-main/80 font-medium">thevinter</span> on the dreamgrove Discord
            server.
          </p>
        </div>
      </div>
    </div>
  )
}
