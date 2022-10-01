import { danger, warn, fail } from 'danger';

// Warn (won’t fail the CI, just post a comment) if the PR has
// changes in package.json but no changes in package-lock.json
const packageChanged = danger.git.modified_files.includes('package.json');
const lockfileChanged = danger.git.modified_files.includes('package-lock.json');
if (packageChanged && !lockfileChanged) {
  warn(
    'Changes were made to package.json, but not to ' +
      'package-lock.json.' +
      'Perhaps you need to run `npm install` and commit changes ' +
      'in package-lock.json. Make sure you’re using npm 5+.',
  );
}

// Fail the CI when test shorcuts are found
const jsTestChanges = danger.git.modified_files.filter((f) => f.endsWith('.spec.js'));
jsTestChanges.forEach((file) => {
  const content = fs.readFileSync(file).toString();
  if (content.includes('it.only') || content.includes('describe.only')) {
    fail(`An \`.only\` was left in tests (${file})`);
  }
});

// Add a CHANGELOG entry for app changes
const hasChangelog = danger.git.modified_files.includes('changelog.md');
const isTrivial = (danger.github.pr.body + danger.github.pr.title).includes('#trivial');
if (!hasChangelog && !isTrivial) {
  warn('Please add a changelog entry for your changes.');
}

const { additions = 0, deletions = 0 } = danger.github.pr;
message(`:tada: The PR added ${additions} and removed ${deletions} lines.`);
const modifiedMD = danger.git.modified_files.join('\n');
message(`Changed Files in this PR: \n ${modifiedMD} \n`);

// No PR is too small to include a description of why you made a change
if (danger.github.pr.body.length < 10) {
  warn('Please include a description of your PR changes.');
}

// Request changes to src also include changes to tests.
const allFiles = danger.git.modified_files.concat(danger.git.created_files);
const hasAppChanges = allFiles.some((p) => includes(p, 'src/'));
const hasTestChanges = allFiles.some((p) => includes(p, '__tests__/'));

if (hasAppChanges && !hasTestChanges) {
  warn('This PR does not include changes to tests, even though it affects app code.');
}

const codeowners = fs.readFileSync('.github/CODEOWNERS', 'utf8').split('\n');
let mentions = [];
codeowners.forEach((codeowner) => {
  const pattern = codeowner.split(' ')[0];
  const owners = codeowner.substring(pattern.length).trim().split(' ');

  const modifiedFileHasOwner = (path) => minimatch(path, pattern);
  const modifiesOwnedCode = danger.git.modified_files.filter(modifiedFileHasOwner).length > 0;

  if (modifiesOwnedCode) {
    mentions = mentions.concat(owners);
  }
});
const isOwnedCodeModified = mentions.length > 0;
if (isOwnedCodeModified) {
  const uniqueMentions = new Set(mentions);
  markdown(`## Automatic reviewers
  
cc: ${[...uniqueMentions].join(', ')}`);
}
