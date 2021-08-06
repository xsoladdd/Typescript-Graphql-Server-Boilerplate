# Typescript Graphql Server Boilerplate

This boilerplate includes the ff technologies.

- apollo-server-express
- crypto-js
- graphql
- type-graphql
- typeorm

## Installation guide

## Commands to start

```
git clone
cd folder
yarn install
touch .env `copy .env.example format`
```

## Create migration

```
yarn typeorm migration:generate -n MigrationName

yarn typeorm migration:create -n # For DIY migration

yarn typeorm migration:run/revert


```
