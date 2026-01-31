export class AddTable{
    constructor(){
        this.row;
        this.cell;
        this.cellText;
        this.cellP;
        
        this.table = document.createElement("table");
        this.tHead = document.createElement("thead");
        this.tableBody = document.createElement("tbody");
        this.hRow = document.createElement("tr");

        this.table.appendChild(this.tHead)
        this.tHead.appendChild(this.hRow)
        this.table.appendChild(this.tableBody);
    }
    getTable(){
        return this.table;
    }
    getTableBody(){
        return this.tableBody;
    }
    getHeader(){
        return this.tHead;
    }
    createRow(){
        return document.createElement("tr")
    }
    addHeader(rowHeadNames){
        for(var i=0; i<rowHeadNames.length; i++){
            const headCell = document.createElement("th");
            this.hRow.appendChild(headCell);
            headCell.innerHTML = rowHeadNames[i]
        }
    }
    addCell(data, row, header=false){
        this.cell = document.createElement("td");
        if (header) this.cell = document.createElement("th");
        this.cellText = document.createElement("div");
        this.cellP = document.createElement("p");

        this.cellP.innerHTML = data;
  
        row.appendChild(this.cell);
        this.cell.appendChild(this.cellText);
        this.cellText.appendChild(this.cellP);
    }
    addTextCell(data, row, box_id, input_id){
        this.cell = document.createElement("td");
        this.cellText = document.createElement("div");
        if(box_id){
            this.cell.setAttribute("class", box_id)
        }
        this.txtBox = document.createElement("INPUT");
        this.txtBox.setAttribute("type", "text");
        this.txtBox.setAttribute("value", data);
        if(input_id){
            this.txtBox.setAttribute("class", input_id)
        }
  
        row.appendChild(this.cell);
        this.cell.appendChild(this.cellText);
        this.cellText.appendChild(this.txtBox);

        return this.txtBox;
    }
    addCells(rowHeadNames, data, row){
        //needs to take data and return row that is passed onto something else
        if (!data || typeof data !== 'object') data = {};
        for(var i=0;i<rowHeadNames.length;i++){
            this.cell = document.createElement("td");
            this.cellText = document.createElement("div");
            this.cellP = document.createElement("p");

            // try exact key first, then fallback to fuzzy matching of keys
            const headerKey = rowHeadNames[i];
            let value = data[headerKey];
            if (value === undefined) {
                // log missing key for debugging
                try { console.warn('AddTable.addCells: missing key', headerKey, 'available keys:', Object.keys(data)); } catch (e) {}
                // normalize helper
                const normalize = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, "");
                const target = normalize(headerKey);
                let bestMatch = null;
                let bestScore = 0;
                for (const k of Object.keys(data)) {
                    const nk = normalize(k);
                    if (nk === target) { bestMatch = k; bestScore = Infinity; break; }
                    // score by token overlap
                    const tk = new Set(nk.match(/[a-z0-9]+/g) || []);
                    const tt = new Set(target.match(/[a-z0-9]+/g) || []);
                    let common = 0;
                    tk.forEach(t => { if (tt.has(t)) common++; });
                    if (common > bestScore) { bestMatch = k; bestScore = common; }
                }
                if (bestMatch) value = data[bestMatch];
            }
            this.cellP.innerHTML = (value === undefined || value === null || value === "") ? "NA" : value;
  
            row.appendChild(this.cell);
            this.cell.appendChild(this.cellText);
            this.cellText.appendChild(this.cellP);
            //console.log(data[color[i]][j+1][headNames[g]])
        }
        return row;
    }
    setID(id) {
        this.table.setAttribute("id", id);
    }
    setHeaderID(id) {
        this.tHead.setAttribute("id", id);
    }
    setBodyID(id) {
        this.tableBody.setAttribute("id", id);
    }
}