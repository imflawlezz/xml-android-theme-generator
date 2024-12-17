function getTextColor(hex) {
    const color = tinycolor(hex);
    return color.isLight() ? "#000000" : "#FFFFFF";
}

function generateShades(hex, method) {
	const shades = {
		// primary group
		primary: hex,
		primaryVariant: tinycolor(hex).darken(15).toHexString(),
		colorOnPrimary: getTextColor(hex), 
		// primary night group
		primaryNight: tinycolor(hex).darken(22).toHexString(),
		primaryNightVariant: tinycolor(hex).darken(35).toHexString(),
        colorOnPrimaryNight: getTextColor(tinycolor(hex).darken(25).toHexString()),
		// misc group
		background: tinycolor(hex).lighten(30).desaturate(25).toHexString(),
		backgroundNight: tinycolor(hex).darken(20).desaturate(50).toHexString(),
		
		//nightTextPrimary: tinycolor(hex).lighten(60).toHexString()
	};
		// secondary group
	if (method === 'complementary') {
		shades.secondary = tinycolor(hex).complement().toHexString();
	} else {
		shades.secondary = tinycolor(hex).lighten(15).toHexString();
	}
	shades.secondaryVariant = tinycolor(shades.secondary).desaturate(15).toHexString();
	shades.colorOnSecondary = getTextColor(hex);
		// secondary night group
	shades.secondaryNight = tinycolor(shades.secondary).darken(30).toHexString();
	shades.secondaryNightVariant = tinycolor(shades.secondaryNight).desaturate(15).toHexString();
    shades.colorOnSecondaryNight = getTextColor(tinycolor(shades.secondary).darken(45).toHexString());

	return shades;
}

function createColorsXml(shades, isNight = false) {
    return `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="primary">#FF${(isNight ? shades.primaryNight : shades.primary).slice(1)}</color>
    <color name="primaryVariant">#FF${(isNight ? shades.primaryNightVariant : shades.primaryVariant).slice(1)}</color>
    <color name="colorOnPrimary">#FF${(isNight ? shades.colorOnPrimaryNight : shades.colorOnPrimary).slice(1)}</color>

    <color name="secondary">#FF${(isNight ? shades.secondaryNight : shades.secondaryNight).slice(1)}</color>
    <color name="secondaryVariant">#FF${(isNight ? shades.secondaryNightVariant : shades.secondaryVariant).slice(1)}</color>
    <color name="colorOnSecondary">#FF${(isNight ? shades.colorOnSecondaryNight : shades.colorOnSecondary).slice(1)}</color>

    <color name="background">#FF${(isNight ? shades.backgroundNight : shades.background).slice(1)}</color>
</resources>`;
}

function createThemesXml(fontSize, fontFamily, appName) {
    return `<?xml version="1.0" encoding="utf-8"?>
<resources xmlns:tools="http://schemas.android.com/tools">
    <style name="Theme.${appName}" parent="Theme.MaterialComponents.DayNight.DarkActionBar">
        <item name="colorPrimary">@color/primary</item>
        <item name="colorPrimaryVariant">@color/primaryVariant</item>
        <item name="colorOnPrimary">@color/colorOnPrimary</item>

        <item name="colorSecondary">@color/secondary</item>
        <item name="colorSecondaryVariant">@color/secondaryVariant</item>
        <item name="colorOnSecondary">@color/colorOnSecondary</item>

        <item name="android:fontFamily">${fontFamily}</item>
        <item name="android:textSize">${fontSize}sp</item>
    </style>
</resources>`;
}

function generateFilesAndPreview() {
    const appName = document.getElementById("appName").value.replaceAll(" ", "");
    const primaryColor = document.getElementById("primaryColor").value;
    const fontSize = document.getElementById("fontSize").value;
    const fontFamily = document.getElementById("fontFamily").value;
    const nightTheme = document.getElementById("nightTheme").checked;
    const method = document.querySelector('input[name="secondaryMethod"]:checked').value;

    const shades = generateShades(primaryColor, method);
    const colorsXml = createColorsXml(shades);
    const colorsNightXml = nightTheme ? createColorsXml(shades, true) : null;
    const themesXml = createThemesXml(fontSize, fontFamily, appName);

    displayColorPreview(shades);
    displayXmlFiles({ colors: colorsXml, themes: themesXml, colors_night: colorsNightXml });
}

function displayColorPreview(shades) {
    const previewContainer = document.getElementById("colorPreview");
    previewContainer.innerHTML = '';

    const colorRoles = [
        { name: "Primary", color: shades.primary },
        { name: "Primary Variant", color: shades.primaryVariant },
        { name: "Color On Primary", color: shades.colorOnPrimary },
        { name: "Secondary", color: shades.secondary },
        { name: "Secondary Variant", color: shades.secondaryVariant },
        { name: "Color On Secondary", color: shades.colorOnSecondary },
        { name: "Background", color: shades.background },
        { name: "Primary Night", color: shades.primaryNight },
        { name: "Primary Night Variant", color: shades.primaryNightVariant },
        { name: "Color On Primary Night", color: shades.colorOnPrimaryNight },
        { name: "Secondary Night", color: shades.secondaryNight },
        { name: "Secondary Night Variant", color: shades.secondaryNightVariant },
        { name: "Color On Secondary Night", color: shades.colorOnSecondaryNight },
        { name: "Background Night", color: shades.backgroundNight }
    ];

    colorRoles.forEach(role => {
        const colorBox = document.createElement("div");
        colorBox.className = "color-box";
        colorBox.style.backgroundColor = role.color;
        colorBox.style.color = getTextColor(role.color);
        colorBox.innerHTML = `<strong>${role.name}</strong><br>${role.color}`;
        previewContainer.appendChild(colorBox);
    });
}

function displayXmlFiles(files) {
    const output = document.getElementById("xmlOutput");
    output.innerHTML = '';

    Object.entries(files).forEach(([name, content]) => {
        const escapedContent = content
            .replaceAll(/&/g, "&amp;")
            .replaceAll(/</g, "&lt;")
            .replaceAll(/>/g, "&gt;")
            .replaceAll(/"/g, "&quot;")
            .replaceAll(/'/g, "&#39;");

        const fileBlock = document.createElement("div");
        fileBlock.innerHTML = `
            <h2>${name}.xml:</h2>
            <pre><code class="language-xml">${escapedContent}</code></pre>
            <a class="download-link" href="data:text/xml;charset=utf-8,${encodeURIComponent(content)}" download="${name}.xml">Download ${name}.xml</a>
        `;
        output.appendChild(fileBlock);
    });
}