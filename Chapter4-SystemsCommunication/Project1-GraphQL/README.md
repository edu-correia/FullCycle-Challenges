# Project #1 - GraphQL
### Chapter 4 - Systems Communication

<br>

## :clipboard: Project description:
Simple project in GoLang learning how to use GraphQL and it benefits. This project has 2 actions: create a new category or listing all categories.

<br>

## :arrow_forward: How to run it:
First, create your categories table inside ./data.db:\
`CREATE TABLE categories(id STRING, name STRING, description STRING);`

After that, type the following command to start the server:\
`go run cmd/server/server.go`

Then, run your queries and mutations at [localhost:8080](localhost:8080):\

```graphql
mutation createCategory {
  createCategory(input: {
    name: "Name Test 3",
    description: "Description Test 3"
  }) {
    id
    name
    description
  }
}
 query queryCategories {
  categories {
    id
    name
    description
  }
}
```