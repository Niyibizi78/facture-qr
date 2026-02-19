export default async function handler(req, res) {
    const API_KEY = "470c4624af8127aa1a817668b63399ef";
    
    // URL MISE À JOUR (Sans le "api." devant)
    const url = "https://axonaut.com/api/v2/invoices?limit=1&sort=-id";

    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'userConfig': API_KEY,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            return res.send(`<h1>Erreur Axonaut</h1><p>Statut : ${response.status}</p><p>${errorText}</p>`);
        }

        const data = await response.json();
        const inv = (data.data && data.data.length > 0) ? data.data[0] : null;

        if (!inv) {
            return res.send("<h1>Connexion Réussie ! ✅</h1><p>Mais aucune facture validée n'a été trouvée. Validez une facture dans Axonaut pour qu'elle s'affiche ici.</p>");
        }

        return res.send(`
            <html>
            <head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
            <body style="font-family:sans-serif; text-align:center; padding:50px; background:#f4f7f6;">
                <div style="max-width:400px; margin:auto; background:white; padding:30px; border-radius:20px; box-shadow:0 10px 20px rgba(0,0,0,0.1); border-top:8px solid #e67e22;">
                    <h1 style="color:#e67e22; font-size:45px; margin:10px 0;">${inv.total_ttc} €</h1>
                    <p>Facture <strong>${inv.number}</strong></p>
                    <p>Client : ${inv.customer_name}</p>
                    <a href="${inv.public_path}" target="_blank" style="display:block; background:#e67e22; color:white; padding:15px; border-radius:10px; text-decoration:none; font-weight:bold; margin-top:20px;">VOIR LA FACTURE</a>
                </div>
            </body>
            </html>
        `);

    } catch (e) {
        return res.send(`<h1>Erreur de connexion</h1><p>Détail : ${e.message}</p>`);
    }
}
