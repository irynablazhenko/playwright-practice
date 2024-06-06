FROM mcr.microsoft.com/playwright:v1.43.1-jammy

WORKDIR /playwright-tests

COPY . .

RUN npm install

CMD ["npx", "playwright", "test", "--project=ui-tests"]