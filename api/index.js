export default async function handler(req, res) {
    const API_KEY = "470c4624af8127aa1a817668b63399ef";
    // On essaie l'URL la plus large possible
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
        
        // On récupère ce que l'API nous donne vraiment
        let list = data.data || data;

        // SI C'EST VIDE, ON AFFICHE LE DIAGNOSTIC
        if (!list || (Array.isArray(list) && list.length === 0)) {
            return res.send(`
                <h1>Diagnostic Axonaut</h1>
                <p>La connexion est OK, mais la liste est vide.</p>
                <p><b>Réponse brute de l'API :</b></p>
                <pre style="background:#eee; padding:10px; border-radius:5px;">${JSON.stringify(data, null, 2)}</pre>
                <hr>
                <p>Si vous voyez <b>"data": []</b> ci-dessus, essayez de vérifier si vos factures sont bien des "Factures" et non des "Commandes" ou des "Devis" dans Axonaut.</p>
            `);
        }

        // SI ON A DES DONNÉES, ON TRIE ET ON AFFICHE
        if (Array.isArray(list)) {
            list.sort((a, b) => (b.id || 0) - (a.id || 0));
            const inv = list[0];

            return res.send(`
                <html>
                <head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
                <body style="font-family:sans-serif; text-align:center; padding:50px; background:#f4f7f6;">
                    <div style="max-width:400px; margin:auto; background:white; padding:30px; border-radius:20px; box-shadow:0 10px 20px rgba(0,0,0,0.1); border-top:8px solid #e67e22;">
                        <p style="text-transform:uppercase; color:gray; font-size:12px;">Dernière Facture Trouvée</p>
                        <h1 style="color:#e67e22; font-size:45px; margin:10px 0;">${inv.total_amount || inv.total_ttc || '0'} €</h1>
                        <p>Facture <strong>${inv.number || 'Sans numéro'}</strong></p>
                        <p>Client : ${inv.customer_name || (inv.customer ? inv.customer.name : 'Inconnu')}</p>
                        <a href="${inv.public_path || '#'}" target="_blank" style="display:block; background:#e67e22; color:white; padding:15px; border-radius:10px; text-decoration:none; font-weight:bold; margin-top:20px;">VOIR LE PDF</a>
                    </div>
                </body>
                </html>
            `);
        }

    } catch (e) {
        return res.send(`<h1>Erreur de scan</h1><p>${e.message}</p>`);
    }
}
