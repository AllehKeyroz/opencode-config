export default async function plugin(ctx) {
  return {
    // A hook de AUTH faz o provider aparecer no comando /connect e opencode auth
    auth: {
      provider: "keyroz", // O ID interno do provider
      methods: [
        {
          type: "api",
          label: "Keyroz API Key",
          prompts: [
            {
              type: "text",
              key: "apiKey",
              message: "Insira sua Keyroz API Key:"
            }
          ],
          async authorize(inputs) {
            // Aqui voce valida a chave. Se OK, retorna success.
            return {
              type: "success",
              key: inputs.apiKey
            };
          }
        }
      ]
    },
    // Opcional: A hook de PROVIDER define os modelos atrelados a ele
    provider: {
      id: "keyroz",
      async models() {
        return {
          "keyroz-ultra": {
            name: "Keyroz Ultra v1",
            limit: { context: 200000, output: 8192 },
            modalities: { input: ["text", "image"], output: ["text"] }
          }
        };
      }
    }
  };
}
