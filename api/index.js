export default async function handler(req, res) {
    const API_KEY = "470c4624af8127aa1a817668b63399ef";
    const url = `https://api.axonaut.com/api/v2/invoices?limit=1&sort=-id&userConfig=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // Vérification du format de réponse Axonaut
        const inv = (data.data && data.data[0]) ? data.data[0] : (data[0] ? data[0] : null);

        if (!inv) {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            return res.status(200).send("<h1>Aucune facture trouvée.</h1>");
        }

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.send(`
            <html>
            <body style="font-family:sans-serif; text-align:center; padding:50px; background:#f4f7f6;">
                <div style="max-width:400px; margin:auto; background:white; padding:30px; border-radius:20px; box-shadow:0 10px 20px rgba(0,0,0,0.1); border-top:8px solid #e67e22;">
                    <h1 style="color:#e67e22; font-size:45px; margin:10px 0;">${inv.total_ttc} €</h1>
                    <p style="font-size:18px;">Facture ${inv.number}<br><strong>${inv.customer_name}</strong></p>
                    <a href="${inv.public_path}" target="_blank" style="display:block; background:#e67e22; color:white; padding:15px; border-radius:10px; text-decoration:none; font-weight:bold; margin-top:20px;">TÉLÉCHARGER LE PDF</a>
                </div>
            </body>
            </html>
        `);
    } catch (error) {
        return res.status(500).send("Erreur de connexion à Axonaut : " + error.message);
    }
}
