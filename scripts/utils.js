const {exec} = require('child_process');
const semver = require('semver');

module.exports = {
  run: (cmd) => new Promise((resolve, reject) => {
    exec(cmd, {}, (error, stdout, stderr) => {
      if (error) {
        reject(stderr.trim());
      } else {
        resolve(stdout.trim());
      }
    });
  }),

  /**
   * Returns, based on existing npm `tags`, the tag under which to publish the given `version`.
   */
  semtag: (tags, version) => {
    const {latest} = tags;

    // Versions prior to 'latest' are marked 'untagged'.
    if (latest && semver.gte(latest, version)) {
      return 'untagged';
    }

    // Full versions greater than 'latest' become the new 'latest'.
    if (!semver.prerelease(version)) {
      return 'latest';
    }

    // Pre-versions for the same 'latest' major version are tagged 'dev', else are
    // tagged 'next' for a greater major version. However, if the tag already exists
    // with a greater version, the version to publish is marked 'untagged'.
    const tag = latest && semver.major(latest) < semver.major(version) ? 'next' : 'dev';
    if (tags[tag] && semver.lte(version, tags[tag])) {
      return 'untagged';
    }

    return tag;
  }
};
