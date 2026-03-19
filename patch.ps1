$files = @(
    "src\pages\NhapHangPage\components\NhapHangDialog.tsx",
    "src\pages\NhapHangChiTietPage\components\NhapHangChiTietDialog.tsx",
    "src\pages\XuatHangChiTietPage\components\XuatHangChiTietDialog.tsx",
    "src\pages\DuAnPage\components\DuAnDialog.tsx",
    "src\pages\LoaiKhoPage\components\LoaiKhoDialog.tsx",
    "src\pages\DonViVanChuyenPage\components\DonViVanChuyenDialog.tsx",
    "src\pages\DoiXePage\components\DoiXeDialog.tsx",
    "src\pages\NhanSuPage\components\NhanSuDialog.tsx",
    "src\pages\PhanQuyenPage\components\PhanQuyenDialog.tsx",
    "src\pages\LocTonKhoPage\components\LocTonKhoDialog.tsx",
    "src\pages\ThanhToanNhapPage\components\ThanhToanNhapDialog.tsx",
    "src\pages\ThanhToanXuatPage\components\ThanhToanXuatDialog.tsx",
    "src\pages\XuatHangPage\components\XuatHangDialog.tsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw -Encoding UTF8
        if ($content -notmatch "createPortal") {
            # 1. Add import
            $content = $content -replace "import React, \{ useState, useEffect \} from 'react';", "import React, { useState, useEffect } from 'react';`nimport { createPortal } from 'react-dom';"
            $content = $content -replace "import React, \{ useState \} from 'react';", "import React, { useState } from 'react';`nimport { createPortal } from 'react-dom';"

            # 2. Replace return wrapper
            $content = $content -replace "(?s)if \(\!isOpen && \!isClosing\) return null;\s*return \(", "if (!isOpen && !isClosing) return null;`n`n  return createPortal("

            # 3. Replace end tag wrapper
            if ($content -match "export default ([a-zA-Z0-9_]+);") {
                $name = $matches[1]
                $content = $content -replace "(?s)\s*<\/div>\s*\);\s*};\s*export default $name;", "`n    </div>,`n    document.body`n  );`n};`n`nexport default $name;"
                
                $utf8NoBom = New-Object System.Text.UTF8Encoding $False
                [IO.File]::WriteAllText((Resolve-Path $file).Path, $content, $utf8NoBom)
                Write-Host "Patched: $file"
            }
        } else {
            Write-Host "Skipped (already patched): $file"
        }
    } else {
        Write-Host "Not found: $file"
    }
}
Write-Host "DONE"
