using System;
using System.IO;
using System.Xml;
using System.Collections.Generic;
using System.Web.Script.Serialization;
using System.IO.Compression;
using System.Linq;

public class Program {
    public static void Main() {
        string tempDir = @"C:\Users\um624\.gemini\antigravity\scratch\iec-attendance-app\temp_excel";
        string excelFile = @"C:\Users\um624\.gemini\antigravity\scratch\iec-attendance-app\traveltimes1.xlsx";
        
        if (Directory.Exists(tempDir)) Directory.Delete(tempDir, true);
        ZipFile.ExtractToDirectory(excelFile, tempDir);
        
        string sharedFile = Path.Combine(tempDir, @"xl\sharedStrings.xml");
        List<string> sharedStrings = new List<string>();
        if (File.Exists(sharedFile)) {
            XmlDocument sDoc = new XmlDocument();
            sDoc.Load(sharedFile);
            XmlNamespaceManager ns = new XmlNamespaceManager(sDoc.NameTable);
            ns.AddNamespace("x", "http://schemas.openxmlformats.org/spreadsheetml/2006/main");
            foreach (XmlNode node in sDoc.SelectNodes("//x:si", ns)) {
                sharedStrings.Add(node.InnerText);
            }
        }
        
        string sheetFile = Path.Combine(tempDir, @"xl\worksheets\sheet1.xml");
        var table = new List<Dictionary<string, object>>();
        
        XmlDocument doc = new XmlDocument();
        doc.Load(sheetFile);
        XmlNamespaceManager sns = new XmlNamespaceManager(doc.NameTable);
        sns.AddNamespace("x", "http://schemas.openxmlformats.org/spreadsheetml/2006/main");
        
        foreach (XmlNode rowNode in doc.SelectNodes("//x:row", sns)) {
            var rowData = new Dictionary<string, object>();
            rowData["RowIndex"] = int.Parse(rowNode.Attributes["r"].Value);
            
            foreach (XmlNode cNode in rowNode.SelectNodes("x:c", sns)) {
                string r = cNode.Attributes["r"].Value;
                string col = new string(r.ToCharArray().Where(c => char.IsLetter(c)).ToArray());
                string type = cNode.Attributes["t"] != null ? cNode.Attributes["t"].Value : null;
                string val = "";
                
                XmlNode vNode = cNode.SelectSingleNode("x:v", sns);
                if (vNode != null) {
                    string rawVal = vNode.InnerText;
                    if (type == "s") {
                        int idx;
                        if (int.TryParse(rawVal, out idx) && idx < sharedStrings.Count) {
                            val = sharedStrings[idx];
                        }
                    } else {
                        val = rawVal;
                    }
                }
                rowData[col] = val;
            }
            table.Add(rowData);
        }
        
        JavaScriptSerializer serializer = new JavaScriptSerializer();
        serializer.MaxJsonLength = Int32.MaxValue;
        string json = serializer.Serialize(table);
        File.WriteAllText(@"C:\Users\um624\.gemini\antigravity\scratch\iec-attendance-app\temp_excel_data.json", json, System.Text.Encoding.UTF8);
        Directory.Delete(tempDir, true);
        Console.WriteLine("Done!");
    }
}