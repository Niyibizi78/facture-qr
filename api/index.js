export default async function handler(req, res) {
    const API_KEY = "470c4624af8127aa1a817668b63399ef";
    const url = "https://axonaut.com/api/v2/invoices";

    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'userApiKey': API_KEY,
                'Accept': 'application/json'
            }
        });

        const data = await response.json();
        let invoices = data.data || [];

        if (invoices.length === 0) {
            return res.send("<h1>Aucune facture trouvée dans Axonaut.</h1><p>Vérifiez que vos factures ne sont pas en 'Brouillon'.</p>");
        }

        // --- TRI MANUEL ---
        // On trie les factures de la plus récente (ID le plus grand) à la plus ancienne
        invoices.sort((a, b) => b.id - a.id);

        // On prend la toute première après le tri
        const inv = invoices[0];

        const montant = inv.total_amount || "0.00";
        const client = inv.customer ? inv.customer.name : "Client inconnu";
        const numero = inv.number || "N/A";
        const lienPDF = inv.public_path || "#";

        return res.send(`
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: sans-serif; text-align: center; padding: 20px; background: #f4f7f6; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
                    .card { max-width: 400px; width: 90%; background: white; padding: 30px; border-radius: 25px; box-shadow: 0 15px 35px rgba(0,0,0,0.1); border-top: 10px solid #e67e22; }
                    h1 { color: #e67e22; font-size: 50px; margin: 15px 0; }
                    p { color: #2d3436; font-size: 18px; margin: 5px 0; }
                    .btn { display: block; background: #e67e22; color: white; padding: 18px; border-radius: 15px; text-decoration: none; font-weight: bold; font-size: 18px; margin-top: 25px; }
                </style>
            </head>
            <body>
                <div class="card">
                    <p style="text-transform: uppercase; color: #636e72; font-size: 12px; font-weight: bold;">Dernière Facture</p>
                    <h1>${montant} €</h1>
                    <p>Facture <b>${numero}</b></p>
                    <p>Client : <b>${client}</b></p>
                    <a href="${lienPDF}" target="_blank" class="btn">OUVRIR LA VRAIE FACTURE</a>
                </div>
            </body>
            </html>
        `);

    } catch (e) {
        return res.send(`<h1>Erreur technique</h1><p>${e.message}</p>`);
    }
}
