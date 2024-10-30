const paths = require('../paths');

const clean = async () => {
  const { deleteAsync } = await import('del');
  const deletedFilePaths = await deleteAsync(paths.clean);
  console.log('Deleted files:\n', deletedFilePaths.join('\n'));
};

module.exports = clean;
