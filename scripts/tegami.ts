import { tegami } from "tegami"
import { runCli } from "tegami/cli"
import { github } from "tegami/plugins/github"

const repository = process.env.GITHUB_REPOSITORY?.trim() || "SolZeroAI/oxlint-plugin-solzero"

const release = tegami({
  conventionalCommits: false,
  npm: {
    client: "nub",
    trustedPublish: { provider: "github", workflow: "release.yml" },
  },
  plugins: [
    github({
      repo: repository,
      release: { eager: false },
      versionPr: {
        base: "master",
        branch: "tegami/version-packages",
      },
    }),
  ],
})

await runCli(release)
