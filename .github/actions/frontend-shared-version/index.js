const core = require('@actions/core');
const util = require('util');

const exec = util.promisify(require('child_process').exec);

/**
 * Increment the minor part of a `MAJOR.MINOR.PATCH` semver version.
 */
function bumpMinorVersion(version) {
  const parts = version.split('.')
  if (parts.length !== 3) {
    throw new Error(`${version} is not a valid MAJOR.MINOR.PATCH version`);
  }
  const newMinorVersion = parseInt(parts[1]) + 1;
  return `${parts[0]}.${newMinorVersion}.${parts[2]}`
}

/**
 * Get the current version from npm, bump the minor part by 1 and
 * save that value to package.json.
 */
async function getNewVersion() {
  const repository = core.getInput('repository');
  const result = await exec(`npm view ${repository} version`);
  const newVersion = bumpMinorVersion(result.stdout);
  core.setOutput("updated_version", newVersion);
}

try {
  getNewVersion();
} catch (error) {
  core.setFailed(error.message);
}
