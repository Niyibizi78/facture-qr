export default async function handler(req, res) {
    // Ta clé API
    const API_KEY = "470c4624af8127aa1a817668b63399ef";
    
    // URL pour récupérer la dernière facture validée
    const url = "https://api.axonaut.com/api/v2/invoices?limit=1&sort=-id";

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'userConfig': API_KEY,
                'Accept': 'application/json'
            }
        });

        // Si la réponse n'est pas "OK" (ex: erreur 401, 404, etc.)
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Code ${response.status} : ${errorText}`);
        }

        const data = await response.json();
        
        // On vérifie si on a bien une facture dans les données reçues
        const inv = (data.data && data.data.length > 0) ? data.data[0] : null;

        res.setHeader('Content-Type', 'text/html; charset=utf-8');

        if (!inv) {
            return res.send("<h1>Connecté à Axonaut, mais aucune facture validée n'a été trouvée.</h1><p>Vérifiez que vous avez bien une facture qui n'est plus en 'Brouillon'.</p>");
        }

        // Si tout est bon, on affiche la belle page orange
        return res.send(`
            <html>
            <head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
            <body style="font-family:sans-serif; text-align:center; padding:50px; background:#f4f7f6;">
                <div style="max-width:400px; margin:auto; background:white; padding:30px; border-radius:20px; box-shadow:0 10px 20px rgba(0,0,0,0.1); border-top:8px solid #e67e22;">
                    <h2 style="color:#636e72; font-size:16px; text-transform:uppercase;">Dernière Facture</h2>
                    <h1 style="color:#e67e22; font-size:45px; margin:10px 0;">${inv.total_ttc} €</h1>
                    <p style="font-size:18px;">Facture <strong>${inv.number}</strong></p>
                    <p style="color:#636e72;">Client : ${inv.customer_name}</p>
                    <a href="${inv.public_path}" target="_blank" style="display:block; background:#e67e22; color:white; padding:18px; border-radius:12px; text-decoration:none; font-weight:bold; font-size:18px; margin-top:20px;">VOIR LE PDF</a>
                </div>
            </body>
            </html>
        `);

    } catch (e) {
        // En cas d'erreur, on affiche le détail pour comprendre
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.status(500).send(`<h1>Erreur de connexion</h1><p>Détail : ${e.message}</p>`);
    }
}
