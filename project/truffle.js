

/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * truffleframework.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like truffle-hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura API
 * keys are available for free at: infura.io/register
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

// const HDWalletProvider = require('truffle-hdwallet-provider');
var HDWalletProvider = require("@truffle/hdwallet-provider");

const mnemonic = "<YOUR-MNEMONIC>";
const InfuraAPIKey = "<YOUR-KEY>";

module.exports = {

  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
     },
    // Useful for deploying to a public network.
    // NB: It's important to wrap the provider as a function.
    // rinkeby: {
    //   // provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/${infuraKey}`),
    //   provider : new HDWalletProvider(mnemonic, InfuraAPIKey),

    //     network_id: 4,       // rinkeby's id
    //     gas: 4500000,        // rinkeby has a lower block limit than mainnet
    //     // gasPrice: 10000000000,
    //   confirmations: 0,    // # of confs to wait between deployments. (default: 0)
    //   // timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
    //   skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    // },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "^0.6.0", // A version or constraint - Ex. "^0.5.0"
                         // Can also be set to "native" to use a native solc
      docker: false, // Use a version obtained through docker
    }
  }
}
