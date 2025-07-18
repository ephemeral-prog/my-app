function calculateBMI() {
  const height = parseFloat(document.getElementById("height").value);
  const weight = parseFloat(document.getElementById("weight").value);
  const resultDiv = document.getElementById("result");
  const idealWeightDiv = document.getElementById("ideal-weight");

  if (!height || !weight || height <= 0 || weight <= 0) {
    resultDiv.textContent = "正しい値を入力してください。";
    resultDiv.style.color = "red";
    return;
  }

   const heightM = height / 100;
  const bmi = weight / (heightM ** 2);
  const roundedBMI = bmi.toFixed(1);

  let category = "";
  if (bmi < 18.5) {
    category = "低体重（やせ）";
    color = "blue";
    fontSize = "12px";
  }
    else if (bmi < 25) {
        category = "普通体重";
    color = "green";
    fontSize = "16px";
    }
    else if (bmi < 30) {
        category = "肥満（1度）";
    color = "orange";
    fontSize = "18px";
    }
    else {
        category = "高度肥満"; 
    color = "red";
    fontSize = "20px";
  }
  
  const idealWeight = (22 * heightM * heightM).toFixed(1);

  resultDiv.textContent = `あなたのBMIは ${roundedBMI}（${category}）です。`;
  resultDiv.style.color = color;
  resultDiv.style.fontSize = fontSize;

  idealWeightDiv.textContent = `適正体重（BMI22基準）は約 ${idealWeight} kg です。`;
  idealWeightDiv.style.marginTop = "10px";
  idealWeightDiv.style.fontSize = "16px";
  idealWeightDiv.style.textAlign = "center";
  idealWeightDiv.style.color = "#333";
    
    
}
