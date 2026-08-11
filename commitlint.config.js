export default {
  extends: ['@commitlint/config-conventional'],

  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // A new feature
        'fix', // A bug fix
        'docs', // Documentation changes only
        'style', // Formatting, missing semicolons, etc (no logic change)
        'refactor', // Code change that neither fixes a bug nor adds a feature
        'perf', // Performance improvement
        'test', // Adding or fixing tests
        'build', // Changes to build system or dependencies
        'ci', // CI/CD pipeline changes
        'chore', // Maintenance tasks (e.g. update .gitignore)
        'revert', // Revert a previous commit
      ],
    ],
    'type-case': [2, 'always', 'lower-case'], // type must be lowercase
    'type-empty': [2, 'never'], // type is required

    'scope-case': [2, 'always', 'lower-case'],

    'subject-empty': [2, 'never'],
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'subject-full-stop': [2, 'never', '.'],

    'header-max-length': [2, 'always', 100], // max 100 chars total
    'body-max-line-length': [1, 'always', 120], // warn if body line > 120 chars

    'body-leading-blank': [2, 'always'], // blank line before body
    'footer-leading-blank': [2, 'always'], // blank line before footer
  },
};
