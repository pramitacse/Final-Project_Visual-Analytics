// $(document).ready(function() {
//   // The event listener for the file upload
//   document
//     .getElementById("txtFileUpload")
//     .addEventListener("change", upload, false);

//   // Method that checks that the browser supports the HTML5 File API
//   function browserSupportFileUpload() {
//     var isCompatible = false;
//     if (window.File && window.FileReader && window.FileList && window.Blob) {
//       isCompatible = true;
//     }
//     return isCompatible;
//   }

//   // Method that reads and processes the selected file
//   function upload(evt) {
//     if (!browserSupportFileUpload()) {
//       alert("The File APIs are not fully supported in this browser!");
//     } else {
//       var data = null;
//       var file = evt.target.files[0];
//       var reader = new FileReader();

//       reader.readAsText(file);

//       reader.onload = function(event) {
//         var csvData = event.target.result;
//         data = $.csv.toArrays(csvData);
//         console.table(data);

//         data.forEach(element => {
//           //   console.log(element);
//           element[4] = element[4]
//             .normalize("NFD")
//             .replace(/[\u0300-\u036f]/g, "");
//         });
//         console.log(data);

//         let items = $.csv.toObjects(csvData);
//         // const jsonobject = JSON.stringify(items);
//         // console.log(items)
//         // console.log(jsonobject)

//         $.ajax({
//           type: "POST",
//           url: "/requestProcessing",
//           // dataType:"json",
//           contentType: "application/json;charset=UTF-8",
//           data: JSON.stringify({ data: items }),
//           // data : {'data': "1"},
//           // data :  JSON.stringify(items),
//           success: res => {
//             console.log(res);
//           },
//           error: err => {
//             console.log(err);
//           },
//           complete: () => {
//             alert("done");
//           }
//         });
//         // if (data && data.length > 0) {
//         //   alert('Imported -' + data.length + '- rows successfully!');
//         // } else {
//         //     alert('No data to import!');
//         // }
//       };

//       reader.onerror = function() {
//         alert("Unable to read " + file.fileName);
//       };
//     }
//   }
// });
