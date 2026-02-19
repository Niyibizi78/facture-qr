export default async function handler(req, res) {
    // Ta clé API Axonaut
    const API_KEY = "470c4624af8127aa1a817668b63399ef";
    
    // URL pour récupérer la dernière facture (limit=1 et tri par ID descendant)
    const url = "https://api.axonaut.com/api/v2/invoices?limit=1&sort=-id";

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'userConfig': API_KEY, // On envoie la clé ici, c'est plus sûr
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Erreur Axonaut: ${response.status}`);
        }

        const data = await response.json();
        
        // On cherche la facture dans data.data (format standard API v2)
        const inv = (data.data && data.data.length > 0) ? data.data[0] : null;

        if (!inv) {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            return res.send("<h1>Aucune facture trouvée dans votre compte Axonaut.</h1>");
        }

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.send(`
            <html>
            <head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
            <body style="font-family:sans-serif; text-align:center; padding:50px; background:#f4f7f6;">
                <div style="max-width:400px; margin:auto; background:white; padding:30px; border-radius:20px; box-shadow:0 10px 20px rgba(0,0,0,0.1); border-top:8px solid #e67e22;">
                    <h1 style="color:#e67e22; font-size:45px; margin:10px 0;">${inv.total_ttc} €</h1>
                    <p style="font-size:18px;">Facture <strong>${inv.number}</strong></p>
                    <p style="color:#636e72;">Client : ${inv.customer_name}</p>
                    <a href="${inv.public_path}" target="_blank" style="display:block; background:#e67e22; color:white; padding:18px; border-radius:12px; text-decoration:none; font-weight:bold; font-size:18px; margin-top:20px;">VOIR LA FACTURE (PDF)</a>
                    <p style="font-size:10px; color:#b2bec3; margin-top:25px;">Mise à jour automatique</p>
                </div>
            </body>
            </html>
        `);
    } catch (error) {
        console.error(error);
        res.status(500).setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.send(`<h1>Erreur de connexion</h1><p>${error.message}</p>`);
    }
}
