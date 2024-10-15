export default {
  NAME       : 'tool5',
  VERSION    : '6.0.0',
  DESC       : 'CLI tool for interacting with Web5',
  TOOL5_HOME    : process.env.TOOL5_HOME ?? (
    process.env.HOME
      ? `${process.env.HOME}/.tool5`
      : '.tool5'
  ),
  HOME: process.env.HOME,
};