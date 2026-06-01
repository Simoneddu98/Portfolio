// ============================================================
// CONFIGURAZIONE
// ============================================================

const GEMINI_API_KEY = "INSERISCI_QUI_LA_TUA_CHIAVE";

// ID del Google Sheet (stringa tra /d/ e /edit nell'URL del foglio)
// Se lo script è bound al foglio, lascia stringa vuota "".
const SHEET_ID = "";

const FALLBACK_SUGGERIMENTO =
  "Grazie per averci scritto. Simone ha ricevuto la tua richiesta " +
  "e ti risponderà entro 48 ore per capire insieme come aiutarti al meglio.";

// ============================================================
// HANDLER PRINCIPALE
// ============================================================

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const nome = (data.nome || "Visitatore").trim();
    const email = (data.email || "").trim();
    const richiestaGrezza = (data.messaggio || "").trim();

    if (!email || !richiestaGrezza) {
      return jsonResponse({ status: "error", message: "Email e messaggio sono obbligatori." });
    }

    let suggerimentoAI = FALLBACK_SUGGERIMENTO;
    try {
      suggerimentoAI = chiediAGemini(richiestaGrezza);
    } catch (geminiErr) {
      Logger.log("Gemini fallito, uso fallback: " + geminiErr.toString());
    }

    const sheet = getOrCreateSheet();
    sheet.appendRow([new Date(), nome, email, richiestaGrezza, suggerimentoAI]);

    inviaEmailHTML(nome, email, suggerimentoAI);

    return jsonResponse({ status: "success", rispostaAI: suggerimentoAI });

  } catch (error) {
    Logger.log("ERRORE doPost: " + error.toString());
    return jsonResponse({ status: "error", message: error.toString() });
  }
}

// ============================================================
// TEST — esegui questa funzione dall'editor per verificare
// ============================================================

function testDoPost() {
  const fakeEvent = {
    postData: {
      contents: JSON.stringify({
        nome: "Mario Rossi",
        email: "mario@test.com",
        messaggio: "Vorrei capire come integrare l'AI nel mio team di marketing"
      })
    }
  };
  const result = doPost(fakeEvent);
  Logger.log(result.getContent());
}

// ============================================================
// FOGLIO
// ============================================================

function getOrCreateSheet() {
  const ss = SHEET_ID
    ? SpreadsheetApp.openById(SHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();

  let sheet = ss.getSheetByName("Richieste");
  if (!sheet) {
    sheet = ss.insertSheet("Richieste");
    sheet.appendRow(["Data", "Nome", "Email", "Messaggio", "Risposta AI"]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// ============================================================
// GEMINI
// ============================================================

function chiediAGemini(testoUtente) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const prompt = `Sei l'assistente virtuale di Simone Sanna, AI Trainer e Digital Marketing Specialist con sede a Milano.

Simone aiuta aziende e professionisti a integrare l'intelligenza artificiale nei flussi di lavoro quotidiani. Il suo approccio parte sempre dai processi reali del team: mappa le routine, individua i punti di attrito e progetta sistemi che migliorano il lavoro concreto, non la teoria.

I suoi tre servizi principali sono:
1. FORMAZIONE — Workshop in presenza, online o on-site per team che vogliono integrare l'AI nei processi di tutti i giorni.
2. CONSULENZA — Per chi ha bisogno di un piano strutturato di adozione dell'AI. Analisi dei processi, progettazione di workflow AI-assisted, scrittura di system prompt.
3. CONTENT — Strategia editoriale, copywriting e pianificazione social con AI integrata in ogni fase.

Il suo approccio si riassume in una frase: "Prima il processo. Poi l'AI si inserisce naturalmente."

Il tuo tono deve essere professionale, diretto, competente e caldo.

Un visitatore del portfolio di Simone ha scritto questo messaggio: "${testoUtente}".

Elabora una risposta breve e concreta di massimo 3-4 righe che:
- Riconosca la specifica esigenza o situazione descritta dal visitatore
- Individui quale dei tre servizi (Formazione, Consulenza o Content) è più pertinente
- Offra uno spunto pratico su come potrebbe migliorare il suo lavoro con l'AI
- Inviti al dialogo senza fare promesse di tempi o prezzi

Non usare elenchi puntati. Scrivi come un messaggio diretto e personale.`;

  const response = UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    muteHttpExceptions: true,
  });

  const json = JSON.parse(response.getContentText());
  const testo = json?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!testo) {
    throw new Error("Risposta Gemini vuota: " + response.getContentText().slice(0, 300));
  }

  return testo;
}

// ============================================================
// EMAIL
// ============================================================

function inviaEmailHTML(nome, emailDestinatario, suggerimento) {
  const suggerimentoHTML = (suggerimento || "").replace(/\n/g, "<br>");

  const htmlBody = `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0d0d0d;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0d0d0d;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;">

          <tr>
            <td style="padding-bottom:32px;">
              <p style="margin:0;color:#555;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;">
                Simone Sanna · AI Trainer · Milano
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding-bottom:24px;">
              <h1 style="margin:0 0 16px 0;font-size:22px;font-weight:600;color:#f0f0f0;line-height:1.3;">
                Ciao ${nome}, grazie per avermi scritto.
              </h1>
              <p style="margin:0;font-size:15px;color:#999;line-height:1.7;">
                Ho letto il tuo messaggio. Il mio assistente virtuale ha elaborato un primo spunto su come potremmo lavorare insieme.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding-bottom:32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="background-color:#141414;border-radius:8px;border-left:3px solid #c8f542;">
                <tr>
                  <td style="padding:24px 28px;">
                    <p style="margin:0 0 10px 0;font-size:11px;color:#c8f542;letter-spacing:0.1em;text-transform:uppercase;font-weight:700;">
                      Spunto iniziale
                    </p>
                    <p style="margin:0;font-size:15px;color:#ddd;line-height:1.75;font-style:italic;">
                      ${suggerimentoHTML}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding-bottom:36px;">
              <p style="margin:0;font-size:15px;color:#999;line-height:1.7;">
                Lavorare con l'AI non significa stravolgere tutto dall'oggi al domani. Significa trovare il punto giusto dove inserirla — e costruire da lì. Se vuoi esplorare come potrebbe funzionare per te o per il tuo team, possiamo sentirci di persona.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding-bottom:40px;" align="left">
              <a href="https://cal.com/simone-sanna-ai/chiamata-esplorativa"
                style="display:inline-block;background-color:#c8f542;color:#0d0d0d;text-decoration:none;padding:14px 28px;border-radius:6px;font-size:14px;font-weight:700;letter-spacing:0.02em;">
                Prenota una call conoscitiva gratuita →
              </a>
            </td>
          </tr>

          <tr>
            <td style="border-top:1px solid #1e1e1e;padding-top:24px;">
              <p style="margin:0;font-size:12px;color:#444;line-height:1.6;">
                Hai ricevuto questa mail dopo aver interagito con il portfolio di Simone Sanna.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  MailApp.sendEmail({
    to: emailDestinatario,
    subject: `Ciao ${nome}, ho letto la tua richiesta 👋`,
    htmlBody: htmlBody,
    name: "Simone Sanna",
  });
}

// ============================================================
// UTILITY
// ============================================================

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
