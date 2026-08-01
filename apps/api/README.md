### NestJS Starter Backend

<br>
Required softwares:

1. Docker Desktop
2. Nest CLI (npm i -g @nestjs/cli)
3. All plugins recommended in VS Code for this project

To get started, run:

```
nvm use
npm i
npm run dev:start
npm run migration:run:dev
```

Dev API Key Instructions:

```
INSERT INTO public."DevApiKey"
(id, "assignedTo", "createdAt", "updatedAt", "deletedAt", "hashedApiKey", "hmacId", permissions, "isAdmin")
VALUES('50f7c096-cb33-4ba3-8101-e178c9ac0efc'::uuid, 'Self', '2024-10-15 15:49:07.904', '2024-10-15 15:49:07.904', NULL, '$2b$10$eXj32Q3nzlSMB3cDaW1WKOIQgObX1KkTW2O99cynIaGoi.ueoe6ja', 'f0353367c646705e87292e72dd684e77ab23e0a2b7e4f297ba0d8cfc6afdb1a1', '{UED}', true);
Add the insert statement to your local db and use the below API Key for testing
{
"apiKey": "6d4d219d22163c77362b8db2996701f1cc5598d967dabf98095e3396802c421c",
"assignedTo": "Self"
}
```
