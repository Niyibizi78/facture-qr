export default async function handler(req, res) {
    const API_KEY = "470c4624af8127aa1a817668b63399ef";
    
    // On utilise l'URL de base sans paramètres pour éviter les blocages
    const url = "https://api.axonaut.com/api/v2/invoices";

    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'userConfig': API_KEY,
                'Accept': 'application/json'
            }
        });

        // Si Axonaut répond (même une erreur), on veut savoir quoi
        if (!response.ok) {
            const errorDetail = await response.text();
            return res.send(`<h1>Réponse d'Axonaut</h1><p>Statut : ${response.status}</p><p>Détail : ${errorDetail}</p>`);
        }

        const data = await response.json();
        
        // On cherche la dernière facture dans la liste
        const invoices = data.data || data;
        const inv = (Array.isArray(invoices) && invoices.length > 0) ? invoices[0] : null;

        if (!inv) {
            return res.send("<h1>Connecté à Axonaut ! ✅</h1><p>Mais aucune facture n'a été trouvée. Créez une facture et validez-la.</p>");
        }

        return res.send(`
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: sans-serif; text-align: center; padding: 20px; background: #f4f7f6; }
                    .card { max-width: 350px; margin: auto; background: white; padding: 30px; border-radius: 20px; box-shadow: 0 10px 20px rgba(0,0,0,0.1); border-top: 8px solid #e67e22; }
                    h1 { color: #e67e22; font-size: 40px; margin: 10px 0; }
                    .btn { display: block; background: #e67e22; color: white; padding: 15px; border-radius: 10px; text-decoration: none; font-weight: bold; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="card">
                    <p style="text-transform:uppercase; color:gray; font-size:12px;">Dernière Facture</p>
                    <h1>${inv.total_ttc} €</h1>
                    <p>Facture <b>${inv.number}</b><br>${inv.customer_name}</p>
                    <a href="${inv.public_path}" target="_blank" class="btn">VOIR LE PDF</a>
                </div>
            </body>
            </html>
        `);

    } catch (e) {
        return res.send(`<h1>Erreur de connexion</h1><p>Le serveur n'a pas pu joindre Axonaut : ${e.message}</p>`);
    }
}
