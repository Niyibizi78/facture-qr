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
            return res.send("<h1>Aucune facture trouvée.</h1>");
        }

        // On prend la toute première de la liste
        const inv = invoices[0];

        // On nettoie les données pour éviter le "undefined"
        const montant = inv.total_amount || "0.00";
        const client = inv.customer ? inv.customer.name : "Client inconnu";
        const numero = inv.number || "N/A";
        const lien = inv.public_path || "#";

        return res.send(`
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: sans-serif; text-align: center; padding: 20px; background: #f4f7f6; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
                    .card { max-width: 400px; width: 90%; background: white; padding: 30px; border-radius: 25px; box-shadow: 0 15px 35px rgba(0,0,0,0.1); border-top: 10px solid #e67e22; }
                    h1 { color: #e67e22; font-size: 50px; margin: 15px 0; }
                    p { color: #2d3436; font-size: 18px; line-height: 1.6; }
                    .btn { display: block; background: #e67e22; color: white; padding: 18px; border-radius: 15px; text-decoration: none; font-weight: bold; font-size: 18px; margin-top: 25px; transition: 0.3s; }
                </style>
            </head>
            <body>
                <div class="card">
                    <p style="text-transform: uppercase; letter-spacing: 1px; color: #636e72; font-size: 13px; font-weight: bold;">Dernière Facture</p>
                    <h1>${montant} €</h1>
                    <p>Facture <b>${numero}</b><br>Client : <b>${client}</b></p>
                    <a href="${lien}" target="_blank" class="btn">VOIR LA FACTURE</a>
                </div>
            </body>
            </html>
        `);

    } catch (e) {
        return res.send(`<h1>Erreur de lecture</h1><p>${e.message}</p>`);
    }
}
