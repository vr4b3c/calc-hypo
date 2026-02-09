# Hypoteční kalkulačka (Mortgage Calculator)

Vícefázová hypoteční kalkulačka s 5 kroky vytvořená pomocí Bootstrap 5.3 a čistého JavaScriptu.

## Soubory

- **index.html** - Hlavní HTML soubor s 5-krokovým wizardem
- **app.js** - Kompletní JavaScriptová logika aplikace
- **config.js** - Konfigurační soubor se všemi konstantami
- **send.php** - PHP mailer pro odeslání formuláře emailem

## Funkce

### Krok 1: Výběr typu nemovitosti
Uživatel vybere z 5 typů nemovitostí:
- Byt
- Pozemek
- Rodinný dům
- Chata/chalupa
- Bytový dům

### Krok 2: Hodnota nemovitosti
Zadání kupní nebo odhadní ceny nemovitosti v Kč.

### Krok 3: Výše půjčky
Výběr z předdefinovaných procent (90%, 80%, 60%, 50%) nebo vlastní hodnota pomocí slideru (5-100%).

### Krok 4: Délka splácení
Volba doby splácení pomocí slideru (1-30 let).
Zobrazení vypočítané měsíční splátky pomocí annuitního vzorce.

### Krok 5: Kontaktní formulář
Vyplnění kontaktních údajů:
- Jméno
- E-mail
- Telefon
- PSČ

Po odeslání se všechna data pošlou na server přes PHP mailer.

## Instalace

### 1. Nahrání souborů

Nahrajte všechny soubory na váš webový server:
```
/public_html/
  ├── index.html
  ├── app.js
  ├── config.js
  └── send.php
```

### 2. Konfigurace PHP maileru

Otevřete soubor `send.php` a upravte následující řádky:

```php
// Řádek 57-58 - změňte na váš e-mail a doménu
$toEmail = 'info@example.com'; // CHANGE THIS TO YOUR EMAIL
$fromDomain = 'yourdomain.com'; // CHANGE THIS TO YOUR DOMAIN
```

**DŮLEŽITÉ:** Tyto hodnoty musí být změněny před nasazením do produkce. Aplikace obsahuje kontrolu, která vrátí chybu, pokud zůstanou výchozí hodnoty.

### 3. Nastavení konfigurace (volitelné)

V souboru `config.js` můžete upravit:

```javascript
// Úroková sazba (v procentech)
interestRate: 4.5,

// Předvolené procenta půjčky
loanPercentPresets: [90, 80, 60, 50],

// Rozsah slideru pro procento půjčky
loanPercentSlider: {
  min: 5,
  max: 100,
  step: 5
},

// Rozsah slideru pro délku splácení
durationSlider: {
  min: 1,
  max: 30,
  step: 1
},

// Měna
currency: "Kč",

// PHP endpoint
phpEndpoint: "send.php"
```

### 4. Testování

1. Otevřete `index.html` ve webovém prohlížeči
2. Projděte všech 5 kroků
3. Odešlete testovací formulář
4. Zkontrolujte, zda e-mail dorazil na zadanou adresu

## Technické požadavky

- **Webový server** s podporou PHP (Apache, Nginx, atd.)
- **PHP 7.0 nebo vyšší** s aktivní funkcí `mail()`
- **Moderní webový prohlížeč** (Chrome, Firefox, Safari, Edge)

## Výpočet měsíční splátky

Aplikace používá standardní annuitní vzorec pro výpočet měsíční splátky:

```
M = P × [r(1+r)^n] / [(1+r)^n - 1]

kde:
M = měsíční splátka
P = výše půjčky (principal)
r = měsíční úroková sazba (roční sazba / 12)
n = počet měsíčních splátek (roky × 12)
```

## Poznámky k nasazení

### PHP mail() funkce

Funkce `mail()` vyžaduje správně nakonfigurovaný mail server na vašem hostingu. Pokud e-maily nefungují:

1. **Kontaktujte svého poskytovatele hostingu** - zeptejte se, zda je `mail()` funkce povolena
2. **Alternativy**: Zvažte použití SMTP služeb jako:
   - PHPMailer s Gmail SMTP
   - SendGrid API
   - Mailgun API
   - Amazon SES

### CORS (Cross-Origin Resource Sharing)

Pokud spouštíte aplikaci lokálně nebo na jiné doméně než PHP endpoint, možná budete muset upravit CORS hlavičky v `send.php`.

### Bezpečnost

Před nasazením do produkce:

1. **Přidejte CAPTCHA** nebo jiný anti-spam mechanismus
2. **Implementujte rate limiting** pro ochranu před spamem
3. **Validujte a sanitizujte** všechny vstupy na serveru
4. **Použijte HTTPS** pro šifrovanou komunikaci
5. **Nastavte správné CORS** politiky - v `send.php` změňte `header('Access-Control-Allow-Origin: *');` na konkrétní doménu (např. `https://yourdomain.com`)
6. **Aktualizujte email konfiguraci** v `send.php` (viz sekce Konfigurace PHP maileru výše)

### Přizpůsobení

Všechny konstanty a nastavení jsou v `config.js`, takže můžete snadno upravit:
- Typy nemovitostí
- Rozsahy sliderů
- Úrokovou sazbu
- Texty a popisky
- Měnu

## Struktura kódu

### formData objekt

Všechna data jsou ukládána do objektu `formData`:

```javascript
{
  propertyType: "",      // Typ nemovitosti
  propertyValue: 0,      // Hodnota nemovitosti
  loanPercent: 0,        // Procento půjčky
  loanAmount: 0,         // Výše půjčky
  durationYears: 0,      // Délka splácení
  monthlyPayment: 0,     // Měsíční splátka
  name: "",              // Jméno
  email: "",             // E-mail
  phone: "",             // Telefon
  zip: ""                // PSČ
}
```

## Podpora prohlížečů

Aplikace je kompatibilní s:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Licence

Tento projekt je volně k dispozici pro komerční i nekomerční použití.

## Podpora

Pro dotazy nebo problémy s nasazením prosím vytvořte issue v tomto repozitáři.
