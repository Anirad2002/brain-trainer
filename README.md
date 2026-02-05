# 🧠 Brain Trainer

> **Progresywna aplikacja (PWA) do treningu pamięci i koncentracji**
---

## 📖 Spis treści

- [O projekcie](#o-projekcie)
- [Funkcjonalności](#funkcjonalności)
- [Technologie](#technologie)
- [Struktura projektu](#struktura-projektu)
- [Instalacja](#instalacja)
- [Użytkowanie](#użytkowanie)
- [Gry](#gry)
- [Wielojęzyczność](#wielojęzyczność)
- [Tryb offline](#tryb-offline)
- [Autor](#autor)

---

## 🎯 O projekcie

**Brain Trainer** to nowoczesna progresywna aplikacja (PWA) zaprojektowana w celu poprawy pamięci, koncentracji i sprawności umysłowej poprzez interaktywne mini-gry oraz funkcję odtwarzacza muzyki relaksacyjnej.

### ✨ Główne cechy

- 🎮 **Gry edukacyjne** - "Leksychny atlas" (gra słowna) i "Neuronni pary" (gra memory)
- 🎵 **Odtwarzacz muzyki** - relaksująca muzyka i dźwięki natury
- 👤 **System użytkowników** - rejestracja, logowanie, profil z awatarem
- 📊 **Statystyki** - śledzenie postępów i aktywności
- 🌍 **Wielojęzyczność** - obsługa języków: ukraińskiego, polskiego i angielskiego
- 🎨 **Tryby motywów** - jasny, ciemny i automatyczny
- ⚡ **Offline first** - pełne wsparcie pracy offline dzięki Service Worker

---

## 🚀 Funkcjonalności

### Autoryzacja i uwierzytelnianie
- ✅ Rejestracja nowego konta z walidacją
- ✅ Logowanie użytkownika
- ✅ Odzyskiwanie hasła (generowanie hasła tymczasowego)
- ✅ Walidacja formularzy w czasie rzeczywistym
- ✅ Wskaźnik siły hasła

### Profil użytkownika
- ✅ Personalizacja profilu (imię, wiek, płeć)
- ✅ Wybór awatara (kotka, psa, motyla, lisa)
- ✅ Edycja danych osobowych
- ✅ Zmiana hasła
- ✅ Historia aktywności
- ✅ Statystyki użytkownika

### Gry treningowe
- ✅ **Leksychny atlas** - gra słowna z kategoriami tematycznymi
- ✅ **Neuronni pary** - klasyczna gra memory z różnymi poziomami trudności
- ✅ System punktacji
- ✅ Śledzenie najlepszych wyników

### Odtwarzacz muzyki
- ✅ Relaksująca muzyka
- ✅ Dźwięki natury (lasu, deszczu, morza)
- ✅ Kontrola odtwarzania (play, pauza, zmiana utworu)
- ✅ Lista odtwarzania

### Ustawienia
- ✅ Zmiana języka interfejsu (🇺🇦 🇵🇱 EN)
- ✅ Wybór motywu (jasny/ciemny/auto)
- ✅ Usunięcie konta
- ✅ Informacje o wersji aplikacji

---

## 🛠️ Technologie

| Technologia | Opis |
|------------|------|
| **HTML5** | Semantyczna struktura i multimedia |
| **CSS3** | Nowoczesne style, Flexbox, Grid, animacje |
| **JavaScript ES6+** | Logika aplikacji, moduły, async/await |
| **IndexedDB** | Lokalna baza danych w przeglądarce |
| **Service Worker** | Cache API, praca offline |
| **PWA** | Manifest, ikony, instalacja na urządzeniu |

### Architektura

- ✅ **SPA (Single Page Application)** - routing po stronie klienta
- ✅ **Modułowa struktura** - separacja kodu na moduły
- ✅ **MVC wzorzec** - rozdzielenie logiki, danych i widoku
- ✅ **Offline First** - priorytet dla pracy bez internetu

---

## 💻 Instalacja

### Wymagania
- Nowoczesna przeglądarka wspierająca ES6+ (Chrome, Firefox, Safari, Edge)
- Opcjonalnie: lokalny serwer HTTPS (np. GitHub Pages, Netlify, Vercel)

## 📱 Użytkowanie

### Pierwsze uruchomienie

1. **Rejestracja**
   - Kliknij "Zarejestruj się"
   - Wypełnij formularz (imię, email, hasło)
   - System utworzy konto i automatycznie zaloguje

2. **Uzupełnienie profilu**
   - Przejdź do sekcji "Mój profil"
   - Wybierz awatar
   - Uzupełnij wiek i płeć
   - Zapisz zmiany

3. **Rozpocznij trening**
   - Przejdź do sekcji "Gry"
   - Wybierz grę
   - Trenuj i śledź postępy!

### Instalacja PWA

**Na Androidzie (Chrome):**
1. Otwórz aplikację w Chrome
2. Naciśnij menu (⋮)
3. Wybierz "Zainstaluj aplikację" lub "Dodaj do ekranu głównego"

**Na iOS (Safari):**
1. Otwórz aplikację w Safari
2. Naciśnij przycisk "Udostępnij" 
3. Wybierz "Dodaj do ekranu głównego"

**Na komputerze (Chrome):**
1. Otwórz aplikację w Chrome
2. Kliknij ikonę "+" w pasku adresu
3. Lub przejdź do Menu → "Zainstaluj Brain Trainer"

---

## 🎮 Gry

### 1. Leksychny atlas (Gra słowna)

**Opis:** Odkrywaj słowa z różnych kategorii tematycznych

**Kategorie:**
- 🍎 Warzywa i owoce
- 🐾 Zwierzęta
- 🎨 Kolory
- ⚽ Sport
- 🌍 Kraje
- 🎵 Muzyka

**Mechanika:**
- Kliknij kartę, aby zobaczyć słowo
- Spróbuj zapamiętać wszystkie słowa
- Sprawdź swoją wiedzę!

### 2. Neuronni pary (Memory)

**Opis:** Klasyczna gra memory - znajdź wszystkie pary kart

**Poziomy trudności:**
- 🟢 Łatwy - 8 kart (4 pary)
- 🟡 Średni - 12 kart (6 par)
- 🔴 Trudny - 16 kart (8 par)

**Mechanika:**
- Kliknij dwie karty, aby je odkryć
- Jeśli pasują - zostają odkryte
- Jeśli nie pasują - odwracają się
- Znajdź wszystkie pary!

**System punktacji:**
- Punkty za każdą znalezioną parę
- Bonus za szybkość
- Śledzenie najlepszych wyników

---

## 🌍 Wielojęzyczność

Aplikacja obsługuje trzy języki:
| Ukraiński | uk |
| Polski    | pl |
| Angielski | en |

### Zmiana języka
1. Przejdź do "Ustawienia"
2. Wybierz język z rozwijanej listy
3. Interfejs automatycznie się zaktualizuje

---

## ⚡ Tryb offline

Aplikacja działa w pełni offline dzięki technologii Service Worker i Cache API.

### Co działa offline:
- ✅ Całość interfejsu użytkownika
- ✅ Wszystkie gry
- ✅ Profil użytkownika
- ✅ Statystyki
- ✅ Zmiana ustawień
- ✅ Baza danych (IndexedDB)

### Wskaźnik statusu
- 🟢 **Zielony** - połączenie z internetem
- 🔴 **Czerwony** - tryb offline

### Cache'owane zasoby:
- Wszystkie pliki HTML, CSS, JS
- Obrazy i ikony
- Pliki muzyczne (jeśli były wcześniej załadowane)

---

## 🎨 Motywy

Aplikacja oferuje trzy motywy kolorystyczne:

### ☀️ Jasny
- Domyślny motyw
- Jasne tło, ciemny tekst
- Najlepszy dla dziennego użytku

### 🌙 Ciemny
- Ciemne tło, jasny tekst
- Zmniejsza zmęczenie oczu
- Idealny na wieczór

### 🔄 Automatyczny
- Dostosowuje się do ustawień systemowych
- Przełącza między jasnym a ciemnym automatycznie

---


## 👨‍💻 Autor **Daryna Pasiura** 🎓 Album: 44066
