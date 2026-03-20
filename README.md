# Design OS (Artisan Build Fork)

> **This is a customized fork of Design OS for use through the [Artisan Build](https://artisan.build) Client Portal. It is not intended for local or general use.**

## What is this?

This fork of [Design OS](https://github.com/buildermethods/design-os) has been modified for clients of Artisan Build who access it through the Client Portal. It runs on cloud infrastructure via [sprites.dev](https://sprites.dev) and makes assumptions that are only valid in that environment.

## Do not use this locally

This fork assumes:

- A git remote repository has already been configured by the provisioning system
- The agent should commit and push changes after every operation (to prevent data loss on VPS)
- Users are accessing through the Artisan Build Client Portal infrastructure
- Certain workflows and commands are tailored to Artisan Build's client engagement process

If you want to use Design OS locally or for your own projects, please use the original:

**Original Design OS:** https://github.com/buildermethods/design-os

## For Artisan Build Clients

If you're an Artisan Build client accessing this through the Client Portal, everything is already configured for you. Simply use the slash commands as documented in your project workspace.

## Credits

Design OS was created by [Brian Casel](https://buildermethods.com). This fork is maintained by [Artisan Build](https://artisan.build) for use with our client services.

- **Original Design OS:** https://github.com/buildermethods/design-os
- **Builder Methods:** https://buildermethods.com
- **Artisan Build:** https://artisan.build
