module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // new feature
        "fix", // bug fix
        "docs", // documentation
        "style", // formatting, missing semicolons, etc.
        "refactor", // code change that neither fixes a bug nor adds a feature
        "perf", // performance improvement
        "test", // adding or fixing tests
        "build", // changes to build system or external dependencies
        "ci", // CI/CD changes
        "chore", // other changes that don't modify src or test files
        "revert", // revert a commit
      ],
    ],
    "subject-case": [0],
  },
};
