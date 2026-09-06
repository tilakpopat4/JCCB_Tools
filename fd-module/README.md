# The Junagadh Commercial Co-Operative Bank Ltd.
## Fixed Deposit (FD) Account Opening & Register Module

આ મોડ્યુલ **The Junagadh Commercial Co-Operative Bank Ltd.** ની જરૂરિયાતો મુજબ તૈયાર કરવામાં આવ્યું છે. 

---

### 📁 ફાઈલો અને ડિરેક્ટરીઓની વિગત (File & Folder Structure):

 તમામ ફાઈલો એક જ મુખ્ય ફોલ્ડર **`FD FORM MODULE`** માં ઓર્ગેનાઈઝ કરેલી છે:

1. **[`index.html`](file:///c:/Users/ADMIN/Downloads/FD%20FORM%20MODULE-20260903T113323Z-1-001/FD%20FORM%20MODULE/index.html)** - મુખ્ય એપ્લિકેશન વેબ પેજ (તમામ ૭ સેક્શન, રજીસ્ટર, વ્યાજ દર માસ્ટર અને પ્રિન્ટેબલ 4-Page A4 લેઆઉટ સાથે).
2. **[`app.js`](file:///c:/Users/ADMIN/Downloads/FD%20FORM%20MODULE-20260903T113323Z-1-001/FD%20FORM%20MODULE/app.js)** - એપ્લિકેશન કોર લોજિક (આંકડામાંથી શબ્દોમાં રૂપાંતર, ઓટો મેચ્યોરિટી/વ્યાજ દર ગણતરી, લોકલ સેવ/રજીસ્ટર, JSON એક્સપોર્ટ/ઇમ્પોર્ટ).
3. **[`styles.css`](file:///c:/Users/ADMIN/Downloads/FD%20FORM%20MODULE-20260903T113323Z-1-001/FD%20FORM%20MODULE/styles.css)** - બેંકિંગ થીમ ડિઝાઇન system, રિસ્પોન્સિવ UI અને ઓરિજિનલ A4 પ્રિન્ટ સ્ટાઈલ.
4. **[`PROJECT_STRUCTURE.md`](file:///c:/Users/ADMIN/Downloads/FD%20FORM%20MODULE-20260903T113323Z-1-001/FD%20FORM%20MODULE/PROJECT_STRUCTURE.md)** - ટેક્નિકલ આર્કિટેક્ચર, સિસ્ટમ ફ્લોચાર્ટ (Mermaid Flowcharts), ડેટા સ્કીમા અને સંપૂર્ણ સિસ્ટમ ગાઈડ.
5. **[`assets/`](file:///c:/Users/ADMIN/Downloads/FD%20FORM%20MODULE-20260903T113323Z-1-001/FD%20FORM%20MODULE/assets/)** - બેંક લોગો અને SVG એમ્બ્લેમ જનરેટર (`bank_emblem.js`, `jccb-logo.png.png`).
6. **[`data/`](file:///c:/Users/ADMIN/Downloads/FD%20FORM%20MODULE-20260903T113323Z-1-001/FD%20FORM%20MODULE/data/)** - સેમ્પલ FD એપ્લિકેશન રેકોર્ડ્સ અને રજીસ્ટર ડેટાબેઝ બેકઅપ JSON ફાઈલો.
7. **[`docs/`](file:///c:/Users/ADMIN/Downloads/FD%20FORM%20MODULE-20260903T113323Z-1-001/FD%20FORM%20MODULE/docs/)** - ફોર્મ ફીલ્ડ લિસ્ટ અને બેંક નિયામક ગાઈડલાઈન્સ दस्तावेज.

---

### 🚀 કેવી રીતે વાપરવું (How to Run):

#### ૧. લોકલ પીસી પર (Offline / Local PC):
- ફક્ત `index.html` ફાઈલ પર **Double Click** કરો અથવા કોઈપણ બ્રાઉઝર (Google Chrome, Microsoft Edge, Mozilla Firefox) માં ઓપન કરો.
- કોઈ વધારાના સોફ્ટવેર કે ઈન્ટરનેટ સર્વરની જરૂર નથી.

#### ૨. ભવિષ્યમાં બેંક સર્વર પર હોસ્ટ કરવા (Server Hosting):
- આ ફોલ્ડરની તમામ ફાઈલો અને સબ-ફોલ્ડર્સ (`index.html`, `styles.css`, `app.js`, `assets/`, `data/`, `docs/`) બેંકના વેબ સર્વર (IIS / Apache / Nginx / Tomcat) પર રૂટ ડિરેક્ટરીમાં મૂકવાથી કોઈપણ બેંક શાખાના કમ્પ્યુટરમાંથી સીધું ઍક્સેસ કરી શકાશે.

---

### 💡 મુખ્ય વિશેષતાઓ (Key Features):
- **Section 1**: મુખ્ય અરજદાર અને ૧ થી ૨ જોઈન્ટ અરજદારોની સંપૂર્ણ વિગત (Single/Joint ઓટો સ્વિચ અને Same Address Sync સાથે).
- **Section 2**: ડિપોઝીટ યોજના પસંદગી (FD, Reinvestment, RD, Senior Citizen Special).
- **Section 3**: ૧ થી ૩ ડિપોઝીટ રકમ, આપોઆપ રકમ શબ્દોમાં (Auto Amount In Words - Uppercase English), મુદત (વર્ષ-માસ-દિવસ), ઓટો વ્યાજ દર ગણતરી (Senior Citizen +0.50%, Bulk +0.25%), પેઆઉટ અને રીન્યુઅલ વિકલ્પો.
- **Section 4**: ૧ થી ૪ વારસદાર (Nominees) ની વિગત (DA-1 ફોર્મ) અને સગીર (Minor) હોય તો વાલીની વિગત.
- **Section 5**: Form 15G / Form 15H અને TDS ઘોષણા.
- **Section 6**: Cash, Cheque, NEFT/RTGS, ખાતામાંથી ટ્રાન્સફર અને ભંડોળનો સ્ત્રોત (Source of Funds).
- **Section 7**: KYC દસ્તાવેજોની ચકાસણી અને Maker (Entered By) / Checker (Authorized By) સાઈન-ઓફ.
- **પ્રિન્ટ & PDF સુવિધા**: 4-Page ની અસલ ફિઝિકલ બેંક એપ્લિકેશન ફોર્મેટ, ગ્રાહકની સહીઓ, Maker/Checker સાઈન તથા બેંક સીલ/સિક્કા માટે જગ્યા સાથે.
