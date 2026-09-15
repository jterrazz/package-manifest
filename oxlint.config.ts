import { testing } from '@jterrazz/test/oxlint';
import { compose, defineConfig, library, type OxlintConfig } from '@jterrazz/typescript/oxlint';

// @jterrazz/test 15 declares `testing` structurally (its override's level widens to
// `string`), so the fragment needs naming as the config it is before `compose` takes it.
const config: OxlintConfig = defineConfig(compose(library, testing as OxlintConfig));

export default config;
