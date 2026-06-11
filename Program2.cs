using System;
using System.IO;
using System.Xml;
using System.Collections.Generic;
using System.IO.Compression;
using System.Linq;
using System.Text;

public class Program {
    public static void Main() {
        string tempDir = @"C:\Users\um624\.gemini\antigravity\scratch\iec-attendance-app\temp_excel2";
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
        
        XmlDocument doc = new XmlDocument();
        doc.Load(sheetFile);
        XmlNamespaceManager sns = new XmlNamespaceManager(doc.NameTable);
        sns.AddNamespace("x", "http://schemas.openxmlformats.org/spreadsheetml/2006/main");
        
        XmlNode row1 = doc.SelectSingleNode("//x:row[@r='1']", sns);
        
        Console.OutputEncoding = Encoding.UTF8;
        foreach (XmlNode cNode in row1.SelectNodes("x:c", sns)) {
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
            Console.WriteLine(col + ": " + val);
        }
        Directory.Delete(tempDir, true);
    }
}