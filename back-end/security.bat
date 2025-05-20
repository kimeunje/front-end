@echo off
setlocal enabledelayedexpansion

:: === 환경 설정 ===
REM UTF-8 인코딩 설정
chcp 65001 > nul

:: 관리자 권한 확인 및 요청
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if '%errorlevel%' NEQ '0' (
    echo 관리자 권한으로 실행합니다...
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    echo args = "" >> "%temp%\getadmin.vbs"
    echo For Each strArg in WScript.Arguments >> "%temp%\getadmin.vbs"
    echo args = args ^& " " ^& strArg >> "%temp%\getadmin.vbs"
    echo Next >> "%temp%\getadmin.vbs"
    echo UAC.ShellExecute "%~s0", args, "", "runas", 1 >> "%temp%\getadmin.vbs"
    "%temp%\getadmin.vbs"
    del "%temp%\getadmin.vbs"
    exit /B
)



:: === API 서버 설정 ===
set SERVER_URL="http://localhost:5000"

:: === 유틸리티 함수 ===
set "WHITE=PowerShell -Command Write-Host -ForegroundColor White"
set "GREEN=PowerShell -Command Write-Host -ForegroundColor Green"
set "RED=PowerShell -Command Write-Host -ForegroundColor Red"
set "YELLOW=PowerShell -Command Write-Host -ForegroundColor DarkYellow"

:: === 로그 파일 설정 ===
set "LOG_DIR=%userprofile%\Desktop\보안감사"
set "LOG_FILE=%LOG_DIR%\%USERNAME%_%date:~0,4%%date:~5,2%%date:~8,2%_감사로그.txt"

:: === 로그 디렉토리 생성 ===
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

:: === 로그 보안 정책 파일 생성 ===
secedit /export /cfg %LOG_DIR%\security.inf /areas SECURITYPOLICY >nul 2>&1

ECHO 2025년 상반기 정보보안감사에 따른 각 점검 항목을 검사하는 스크립트입니다.

set USER="김은제"

:: === 메인 실행 ===
:main
    @REM 검증 로직 실행
    call :authenticate_user "사용자 검증" "INFO"
    call :autorun_check "자동 실행 검사" "INFO"
    call :ahnlab_antivirus_check "안랩 검증" "INFO"
    @REM call :antivirus_check "백신 상태 검사 시작" "INFO"
    call :firewall_check "방화벽 설정 검사" "INFO"
    call :screen_saver_check "화면 보호기 검사" "INFO"
    call :user_name_check "윈도우 계정 이름 검사" "INFO"
    call :user_account_list_check "윈도우 계정 목록 검사" "INFO"
    call :user_password_check "윈도우 계정 암호 검사" "INFO"
    call :share_folder_check "공유 폴더 검사" "INFO"
    call :remote_computer_check "원격 설정 검사" "INFO"
    rem call :printer_active_check "프린터 목록 검사" "INFO"
    rem call :program_version_check "비인가 프로그램 설치 검사" "INFO"
    rem call :security_solution_version_check "보안솔루션 버전 검사" "INFO"
    rem call :window_version_check "윈도우 최신 패치 검사" "INFO"
    
    rem @REM 사용자 환경변수 nicednb_audit_user_id 제거
    REG delete HKCU\Environment /F /V nicednb_audit_user_id >nul 2>&1

    rem @REM 로직 종료 후 출력 창 실행
    rem call :exit_to_borwser

    pause
    exit /b



:: === 로그 함수 ===
:log_message

    set "MESSAGE=%~1"
    set "LEVEL=%~2"

    powershell -Command ^
        $progressPreference = 'Continue'; ^

        if ('%LEVEL%' -eq 'INFO') { ^
            %WHITE% '%MESSAGE%' ^
        } elseif ('%LEVEL%' -eq 'PASS') { ^
            %GREEN% '%MESSAGE%' ^
        } else { ^
            %RED% '%MESSAGE%' ^
        }; ^

        $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'; ^

        $log_entry = @{ ^
            timestamp = $timestamp; ^
            level = '%LEVEL%'; ^
            message = '%MESSAGE%'; ^
        }; ^

        $body = ConvertTo-Json $log_entry; ^
        try { ^
            [void](Invoke-RestMethod ^
                    -Method Post ^
                    -Uri '%SERVER_URL%/api/log' ^
                    -Body $body ^
                    -ContentType 'application/json; charset=utf-8') ^
        } catch { ^
            %YELLOW% '[전송 실패] [%MESSAGE%] 로그 서버 연결 오류'; ^
            exit 1; ^
        };
    exit /b


:: === 사용자 검증 ===
:authenticate_user
    call :log_message "사용자 검증 시작" "INFO"

    powershell -Command ^
        Write-Host '잠시만 기다려주세요...'; ^
        $packages = @{ ^
            username = '%USER%'; ^
        }; ^

        $body = ConvertTo-Json $packages; ^
        try { ^
            $response = (Invoke-RestMethod ^
                -Method Post ^
                -Uri '%SERVER_URL%/api/authenticate' ^
                -Body $body ^
                -ContentType 'application/json; charset=utf-8'); ^
        if ('failed' -eq $response.status ) ^
        { ^
            exit 1; ^
        } ^
        else { ^
            Set-ItemProperty ^
                -Path 'HKCU:\Environment' ^
                -Name 'nicednb_audit_user_id' ^
                -Value $response.user_id ^
                -Type String ^
                -Force; ^
        }; ^
        } catch { ^
            %YELLOW% '[전송 실패] [%MESSAGE%] API 서버 연결 오류'; ^
            exit 1; ^
        };

    if %ERRORLEVEL% EQU 0 (
        call :log_message "사용자 검증 성공" "PASS"
    ) else (
        call :log_message "이름 또는 사번이 틀립니다. 운영실에 문의해주세요." "FAIL"
        timeout /t 5 /nobreak > nul
        exit
    )
    exit /b


:: === 1. 화면 보호기 점검 === (완료)
:screen_saver_check
    rem call :log_message "화면 보호기 검사 시작" "INFO"

    powershell -Command ^
        Write-Host '잠시만 기다려주세요...'; ^

        $regPath = 'HKCU:\Control Panel\Desktop'; ^
        $props = Get-ItemProperty -Path $regPath; ^

        $packages = @{ ^
            user_id = (Get-ItemProperty -Path 'HKCU:\Environment').nicednb_audit_user_id; ^
            item_type = '화면보호기 사용'; ^
            actual_value = @{ ^
                screenSaverEnabled=$props.ScreenSaveActive; ^
                screenSaverTime=$props.ScreenSaveTimeOut; ^
                screenSaverSecure=$props.ScreenSaverIsSecure; ^
            }; ^
        }; ^

        $body = ConvertTo-Json $packages; ^
        try { ^
            [void](Invoke-RestMethod ^
            -Method Post ^
            -Uri '%SERVER_URL%/api/validate_check' ^
            -Body $body ^
            -ContentType 'application/json; charset=utf-8') ^
        } catch { ^
            %YELLOW% '[전송 실패] [%MESSAGE%] API 서버 연결 오류'; ^
            exit 1; ^
        };

    if %ERRORLEVEL% EQU 0 (
        rem call :log_message "화면 보호기 검사 성공" "PASS"
    ) else (
        rem call :log_message "화면 보호기 검사 실패" "FAIL"
    )

    exit /b


:: === 2. 계정 이름 점검 === (완료)
:user_name_check
    call :log_message "윈도우 계정 이름 검사 시작" "INFO"

    powershell -Command ^
        Write-Host '잠시만 기다려주세요...'; ^
            $props = Get-WmiObject -Class Win32_UserAccount; ^
            $computerSystem = Get-WmiObject Win32_ComputerSystem; ^
            $workgroup = $computerSystem.Workgroup; ^
            $computername = $computerSystem.Name; ^
            $username = (Get-LocalUser).Where({$_.Enabled -eq $true}).Name; ^

            $packages = @{ ^
                user_id = (Get-ItemProperty -Path 'HKCU:\Environment').nicednb_audit_user_id; ^
                item_type = '사용자 계정명의 적정성'; ^
                actual_value = @{ ^
                    user_name = $username; ^
                    workgroup = $workgroup; ^
                    computer_name = $computername; ^
                }; ^
            }; ^

    $body = ConvertTo-Json $packages; ^
    try { ^
        [void](Invoke-RestMethod ^
        -Method Post ^
        -Uri '%SERVER_URL%/api/validate_check' ^
        -Body $body ^
        -ContentType 'application/json; charset=utf-8') ^
    } catch { ^
        %YELLOW% '[전송 실패] [%MESSAGE%] API 서버 연결 오류'; ^
        exit 1; ^
    };

    if %ERRORLEVEL% EQU 0 (
        call :log_message "윈도우 계정 이름 검사 성공" "PASS"
    ) else (
        call :log_message "윈도우 계정 이름 검사 실패" "FAIL"
    )

    exit /b


:: === 2. 계정 목록 점검 === (완료)
:user_account_list_check
    call :log_message "윈도우 계정 목록 검사 시작" "INFO"

    powershell -Command ^
        Write-Host '잠시만 기다려주세요...'; ^
            $props = Get-WmiObject -Class Win32_UserAccount; ^
            $username = (Get-LocalUser).Where({$_.Enabled -eq $true}).Name; ^
            $packages = @{ ^
                user_id = (Get-ItemProperty -Path 'HKCU:\Environment').nicednb_audit_user_id; ^
                item_type = '불필요한 계정 사용'; ^
                actual_value = @{ ^
                    user_name = $username; ^
                    accounts = @($props.Name); ^
                }; ^
            }; ^

    $body = ConvertTo-Json $packages; ^
    try { ^
        [void](Invoke-RestMethod ^
        -Method Post ^
        -Uri '%SERVER_URL%/api/validate_check' ^
        -Body $body ^
        -ContentType 'application/json; charset=utf-8') ^
    } catch { ^
        %YELLOW% '[전송 실패] [%MESSAGE%] API 서버 연결 오류'; ^
        exit 1; ^
    };

    if %ERRORLEVEL% EQU 0 (
        call :log_message "윈도우 계정 목록 검사 성공" "PASS"
    ) else (
        call :log_message "윈도우 계정 목록 검사 실패" "FAIL"
    )

    exit /b

:: === 3. 계정 암호 점검 === (완료)
:user_password_check
    call :log_message "윈도우 계정 암호 검사 시작" "INFO"

    powershell -Command ^
        Write-Host '잠시만 기다려주세요...'; ^
        $patterns = @{ ^
            minimumPasswordLength = 'MinimumPasswordLength'; ^
            passwordComplexity = 'PasswordComplexity'; ^
            maximumPasswordAge = 'MaximumPasswordAge'; ^
            passwordHistorySize = 'PasswordHistorySize'; ^
        }; ^
        $props = @{}; ^
        foreach ($key in $patterns.Keys) { ^
            $match = Select-String -Path '%LOG_DIR%\security.inf' -Pattern $patterns[$key]; ^
            if ($match) { ^
                $props[$key] = $match.Line.Split('=')[1].Trim(); ^
            }; ^
        }; ^

    $packages1 = @{ ^
        user_id = (Get-ItemProperty -Path 'HKCU:\Environment').nicednb_audit_user_id; ^
        item_type = '패스워드 길이의 적정성'; ^
        actual_value = @{ minimumPasswordLength = $props.minimumPasswordLength }; ^
    }; ^
    $body1 = ConvertTo-Json $packages1; ^
    try { ^
        [void](Invoke-RestMethod ^
            -Method Post ^
            -Uri '%SERVER_URL%/api/validate_check' ^
            -Body $body1 ^
            -ContentType 'application/json; charset=utf-8') ^
    } catch { ^
        %YELLOW% '[전송 실패] [패스워드 길이의 적정성] API 서버 연결 오류'; ^
        exit 1; ^
    }; ^

    $packages2 = @{ ^
        user_id = (Get-ItemProperty -Path 'HKCU:\Environment').nicednb_audit_user_id; ^
        item_type = '패스워드 복잡도 설정'; ^
        actual_value = @{ passwordComplexity = $props.passwordComplexity }; ^
    }; ^
    $body2 = ConvertTo-Json $packages2; ^
    try { ^
        [void](Invoke-RestMethod ^
            -Method Post ^
            -Uri '%SERVER_URL%/api/validate_check' ^
            -Body $body2 ^
            -ContentType 'application/json; charset=utf-8') ^
    } catch { ^
        %YELLOW% '[전송 실패] [패스워드 복잡도 설정] API 서버 연결 오류'; ^
        exit 1; ^
    }; ^

    $packages3 = @{ ^
        user_id = (Get-ItemProperty -Path 'HKCU:\Environment').nicednb_audit_user_id; ^
        item_type = '패스워드 주기적 변경'; ^
        actual_value = @{ maximumPasswordAge = $props.maximumPasswordAge }; ^
    }; ^
    $body3 = ConvertTo-Json $packages3; ^
    try { ^
        [void](Invoke-RestMethod ^
            -Method Post ^
            -Uri '%SERVER_URL%/api/validate_check' ^
            -Body $body3 ^
            -ContentType 'application/json; charset=utf-8') ^
    } catch { ^
        %YELLOW% '[전송 실패] [패스워드 주기적 변경] API 서버 연결 오류'; ^
        exit 1; ^
    }; ^

    $packages4 = @{ ^
        user_id = (Get-ItemProperty -Path 'HKCU:\Environment').nicednb_audit_user_id; ^
        item_type = '동일 패스워드 설정 제한'; ^
        actual_value = @{ passwordHistorySize = $props.passwordHistorySize }; ^
    }; ^
    $body4 = ConvertTo-Json $packages4; ^
    try { ^
        [void](Invoke-RestMethod ^
            -Method Post ^
            -Uri '%SERVER_URL%/api/validate_check' ^
            -Body $body4 ^
            -ContentType 'application/json; charset=utf-8') ^
    } catch { ^
        %YELLOW% '[전송 실패] [동일 패스워드 설정 제한] API 서버 연결 오류'; ^
        exit 1; ^
    };

    if %ERRORLEVEL% EQU 0 (
        call :log_message "윈도우 계정 암호 검사 성공" "PASS"
    ) else (
        call :log_message "윈도우 계정 암호 검사사 실패" "FAIL"
    )

    exit /b


:: === 4. 네트워크 공유 파일 점검 === (진행 중)
:share_folder_check
    call :log_message "공유 폴더 검사 시작" "INFO"

    powershell -Command ^
        Write-Host '잠시만 기다려주세요...'; ^
        $props = Get-WmiObject Win32_Share; ^
        $packages = @{ ^
            user_id = (Get-ItemProperty -Path 'HKCU:\Environment').nicednb_audit_user_id; ^
            item_type = '공유폴더 확인'; ^
            actual_value = @{ ^
                folders = @($props.Name); ^
            }; ^
        }; ^

    $body = ConvertTo-Json $packages; ^
    try { ^
        $response = (Invoke-RestMethod ^
        -Method Post ^
        -Uri '%SERVER_URL%/api/validate_check' ^
        -Body $body ^
        -ContentType 'application/json; charset=utf-8') ^
    } catch { ^
        $res = ConvertFrom-Json $_; ^
        %YELLOW% [요청 실패] [%MESSAGE%] API 서버 연결 오류; ^
        %YELLOW% [실패 원인] $res.error; ^
        exit 1; ^
    };
    if %ERRORLEVEL% EQU 0 (
        call :log_message "공유 폴더 검사 성공" "PASS"
    ) else (
        call :log_message "공유 폴더 검사 실패" "FAIL"
    )

    exit /b


:: === 4. 프린터 활성화 여부 점검 ===
:printer_active_check
    call :log_message "프린터 목록 검사 시작" "INFO"

    powershell -Command ^
        Write-Host '잠시만 기다려주세요...'; ^
        $props = Get-WmiObject -Class Win32_Printer; ^
        $packages = @{ ^
            user_id = (Get-ItemProperty -Path 'HKCU:\Environment').nicednb_audit_user_id; ^
            item_type = '불분명 프린터 확인'; ^
            actual_value = @{ ^
                printers = @($props.Name); ^
            }; ^
            notes = $props; ^
        }; ^

        $body = ConvertTo-Json $packages; ^
        try { ^
            $response = (Invoke-RestMethod ^
            -Method Post ^
            -Uri '%SERVER_URL%/api/check' ^
            -Body $body ^
            -ContentType 'application/json; charset=utf-8') ^
        } catch { ^
            $res = ConvertFrom-Json $_; ^
            %YELLOW% [요청 실패] [%MESSAGE%] API 서버 연결 오류; ^
            %YELLOW% [실패 원인] $res.error; ^
            exit 1; ^
        };

    if %ERRORLEVEL% EQU 0 (
        call :log_message "프린터 목록 검사 성공" "PASS"
    ) else (
        call :log_message "프린터 목록 검사 실패" "FAIL"
    )

    exit /b


:: === 4. 원격 활성화 여부 점검 ===
:remote_computer_check
    call :log_message "원격 설정 검사 시작" "INFO"

    powershell -Command ^
        Write-Host '잠시만 기다려주세요...'; ^

        $regPath = 'HKLM:\System\CurrentControlSet\Control\Terminal Server'; ^
        $props = Get-ItemProperty -Path $regPath; ^
        $packages = @{ ^
            user_id = (Get-ItemProperty -Path 'HKCU:\Environment').nicednb_audit_user_id; ^
            item_type = '원격데스크톱 제한'; ^
            actual_value = @{ ^
                fDenyTSConnections=$props.fDenyTSConnections; ^
            }; ^
        }; ^

        $body = ConvertTo-Json $packages; ^
        try { ^
        [void](Invoke-RestMethod ^
            -Method Post ^
            -Uri '%SERVER_URL%/api/validate_check' ^
            -Body $body ^
            -ContentType 'application/json; charset=utf-8') ^
        } catch { ^
            %YELLOW% '[전송 실패] [%MESSAGE%] API 서버 연결 오류'; ^
            exit 1; ^
        };

    if %ERRORLEVEL% EQU 0 (
        call :log_message "원격 설정 검사 성공" "PASS"
    ) else (
        call :log_message "원격 설정 검사 실패" "FAIL"
    )

    exit /b


:: === 프로그램램 버전 점검 ===
:program_version_check
    call :log_message "비인가 프로그램 설치 검사 시작" "INFO"

    powershell -Command ^
        Write-Host '잠시만 기다려주세요...'; ^
        $WarningPreference='SilentlyContinue'; ^
        $packages = @{ ^
            user_id = (Get-ItemProperty -Path 'HKCU:\Environment').nicednb_audit_user_id; ^
            item_type = '불특정 소프트웨어 확인'; ^
            actual_value = @(); ^
            notes = $program; ^
        }; ^
        $targetPrograms = @('Adobe', 'Microsoft Viewer', '오피스', 'Office', '한글', 'AhnLab'); ^
        foreach ($package in Get-Package) { ^
            foreach ($program in $targetPrograms) { ^
                if ($package.Name -match $program) { ^
                        $packages.actual_value += @{ ^
                        Name = $package.Name; ^
                        Version = $package.Version; ^
                    } ^
                } ^
            } ^
        } ^

        $body = ConvertTo-Json $packages; ^
        try { ^
        [void](Invoke-RestMethod ^
            -Method Post ^
            -Uri '%SERVER_URL%/api/check' ^
            -Body $body ^
            -ContentType 'application/json; charset=utf-8') ^
        } catch { ^
            %YELLOW% '[전송 실패] [%MESSAGE%] API 서버 연결 오류'; ^
            exit 1; ^
        };

    if %ERRORLEVEL% EQU 0 (
        call :log_message "비인가 프로그램 설치 검사 성공" "PASS"
    ) else (
        call :log_message "비인가 프로그램 설치 검사 실패" "FAIL"
    )

    exit /b


:security_solution_version_check
    call :log_message "보안솔루션 버전 검사 시작" "INFO"

    powershell -Command ^
        Write-Host '잠시만 기다려주세요...'; ^
        $WarningPreference='SilentlyContinue'; ^
        $packages = @{ ^
            user_id = (Get-ItemProperty -Path 'HKCU:\Environment').nicednb_audit_user_id; ^
            item_type = '백신 업데이트'; ^
            actual_value = @(); ^
            notes = $program; ^
        }; ^
        $targetPrograms = @('알약', 'PCFILTER'); ^
        foreach ($package in Get-Package) { ^
            foreach ($program in $targetPrograms) { ^
                if ($package.Name -match $program) { ^
                        $packages.actual_value += @{ ^
                        Name = $package.Name; ^
                        Version = $package.Version; ^
                    } ^
                } ^
            } ^
        } ^

        $body = ConvertTo-Json $packages; ^
        try { ^
        [void](Invoke-RestMethod ^
            -Method Post ^
            -Uri '%SERVER_URL%/api/check' ^
            -Body $body ^
            -ContentType 'application/json; charset=utf-8') ^
        } catch { ^
            %YELLOW% '[전송 실패] [%MESSAGE%] API 서버 연결 오류'; ^
            exit 1; ^
        };

    if %ERRORLEVEL% EQU 0 (
    call :log_message "보안솔루션 버전 검사 성공" "PASS"
    ) else (
    call :log_message "보안솔루션 버전 검사 실패" "FAIL"
    )

    exit /b


:window_version_check
    call :log_message "윈도우 최신 패치 검사 시작" "INFO"

    powershell -Command ^
        Write-Host '잠시만 기다려주세요...'; ^
        $ITEM_TYPE = 'OS 패치 확인'; ^
        $DNB_ENV = Get-ItemProperty -Path 'HKCU:\Environment'; ^
        $props = Get-WmiObject -Class Win32_OperatingSystem; ^
        $packages = @{ ^
            user_id = $DNB_ENV.nicednb_audit_user_id; ^
            item_type = $item_type; ^
            actual_value = @{ ^
                windowsVersion=$props.Caption; ^
                windowsBuildNumber=$props.BuildNumber; ^
            }; ^
            notes = $props; ^
        }; ^

        $body = ConvertTo-Json $packages; ^
        try { ^
        [void](Invoke-RestMethod ^
            -Method Post ^
            -Uri '%SERVER_URL%/api/check' ^
            -Body $body ^
            -ContentType 'application/json; charset=utf-8') ^
        } catch { ^
            %YELLOW% '[전송 실패] [%MESSAGE%] API 서버 연결 오류'; ^
            exit 1; ^
        };

    if %ERRORLEVEL% EQU 0 (
        call :log_message "윈도우 최신 패치 검사 성공" "PASS"
    ) else (
        call :log_message "윈도우 최신 패치 검사 실패" "FAIL"
    )

    exit /b


:firewall_check
call :log_message "방화벽 설정 검사 시작" "INFO"

    powershell -Command ^
        Write-Host '잠시만 기다려주세요...'; ^
        $WarningPreference='SilentlyContinue'; ^
        $firewallInfo = @{ ^
            user_id = (Get-ItemProperty -Path 'HKCU:\Environment').nicednb_audit_user_id; ^
            item_type = '방화벽 활성화 확인'; ^
            actual_value = @{}; ^
        }; ^
        ^
        $profiles = @('Domain', 'Private', 'Public'); ^
        foreach ($profile in $profiles) { ^
            $status = (Get-NetFirewallProfile -Name $profile).Enabled; ^
            $firewallInfo.actual_value[$profile] = $status; ^
        }; ^
        ^
        $body = ConvertTo-Json $firewallInfo; ^
        try { ^
            [void](Invoke-RestMethod ^
                -Method Post ^
                -Uri '%SERVER_URL%/api/validate_check' ^
                -Body $body ^
                -ContentType 'application/json; charset=utf-8') ^
        } catch { ^
            Write-Host '[전송 실패] [%MESSAGE%] API 서버 연결 오류'; ^
            exit 1; ^
        };

    if %ERRORLEVEL% EQU 0 (
        call :log_message "방화벽 설정 검사 성공" "PASS"
    ) else (
        call :log_message "방화벽 설정 검사 실패" "FAIL"
    )

    exit /b



:autorun_check
    call :log_message "이동매체 자동실행 제한 검사 시작" "INFO"

    powershell -Command ^
        Write-Host '잠시만 기다려주세요...'; ^
        $WarningPreference='SilentlyContinue'; ^
        $autorunInfo = @{ ^
            user_id = (Get-ItemProperty -Path 'HKCU:\Environment').nicednb_audit_user_id; ^
            item_type = '이동매체 자동실행 제한'; ^
            actual_value = @{}; ^
        }; ^
        ^
        $autorunPath = 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Explorer'; ^
        $nodrivetype = $null; ^
        ^
        if (Test-Path $autorunPath) { ^
            $nodrivetype = Get-ItemProperty -Path $autorunPath -Name 'NoDriveTypeAutoRun' -ErrorAction SilentlyContinue; ^
        } ^
        ^
        if ($nodrivetype -ne $null) { ^
            $value = $nodrivetype.NoDriveTypeAutoRun; ^
            $autorunInfo.actual_value['Setting'] = 'NoDriveTypeAutoRun'; ^
            $autorunInfo.actual_value['Value'] = $value; ^
            $autorunInfo.actual_value['Status'] = if ($value -ge 255 -or $value -eq 95) { '제한됨' } else { '제한되지 않음' }; ^
        } else { ^
            $autorunInfo.actual_value['Setting'] = 'NoDriveTypeAutoRun'; ^
            $autorunInfo.actual_value['Value'] = 'NotFound'; ^
            $autorunInfo.actual_value['Status'] = '제한되지 않음'; ^
        } ^
        ^
        $body = ConvertTo-Json $autorunInfo; ^
        try { ^
        [void](Invoke-RestMethod ^
            -Method Post ^
            -Uri '%SERVER_URL%/api/validate_check' ^
            -Body $body ^
            -ContentType 'application/json; charset=utf-8') ^
        } catch { ^
            %YELLOW% '[전송 실패] [%MESSAGE%] API 서버 연결 오류'; ^
            exit 1; ^
        };

    if %ERRORLEVEL% EQU 0 (
        call :log_message "이동매체 자동실행 제한 검사 성공" "PASS"
    ) else (
        call :log_message "이동매체 자동실행 제한 검사 실패" "FAIL"
    )

    exit /b


:: === 2. 백신 상태 점검 === (완료)
:antivirus_check
    call :log_message "백신 상태 검사 시작" "INFO"

    powershell -Command ^
        Write-Host '백신 상태 확인 중...'; ^

        $mpStatus = Get-MpComputerStatus; ^
        $avStatus = @{ ^
            AntivirusEnabled = $mpStatus.AntivirusEnabled; ^
            RealTimeProtectionEnabled = $mpStatus.RealTimeProtectionEnabled; ^
            AntivirusSignatureLastUpdated = $mpStatus.AntivirusSignatureLastUpdated; ^
        }; ^

        $packages = @{ ^
            user_id = (Get-ItemProperty -Path 'HKCU:\Environment').nicednb_audit_user_id; ^
            item_type = '백신 상태 확인'; ^
            actual_value = @{ ^
                antivirusEnabled = $avStatus.AntivirusEnabled; ^
                realtimeProtectionEnabled = $avStatus.RealTimeProtectionEnabled; ^
                antivirusSignatureLastUpdated = $avStatus.AntivirusSignatureLastUpdated; ^
            }; ^
        }; ^

        $body = ConvertTo-Json $packages; ^
        try { ^
            [void](Invoke-RestMethod ^
            -Method Post ^
            -Uri '%SERVER_URL%/api/validate_check' ^
            -Body $body ^
            -ContentType 'application/json; charset=utf-8') ^
        } catch { ^
            %YELLOW% '[전송 실패] [%MESSAGE%] API 서버 연결 오류'; ^
            exit 1; ^
        };

    if %ERRORLEVEL% EQU 0 (
        call :log_message "백신 상태 검사 성공" "PASS"
    ) else (
        call :log_message "백신 상태 검사 실패" "FAIL"
    )

    exit /b


:: === 2. 알약 백신 상태 점검 === (완료)
:ahnlab_antivirus_check
    rem call :log_message "알약 백신 상태 검사 시작" "INFO"

    powershell -Command ^
        Write-Host '알약 백신 상태 확인 중...'; ^
        ^
        $thirdPartyAV = Get-CimInstance -Namespace root/SecurityCenter2 -ClassName AntivirusProduct; ^
        ^
        function Get-AVStatus($productState) { ^
            $hexString = [Convert]::ToString($productState, 16).PadLeft(6, '0'); ^
            ^
            $realTimeProtection = 0; ^
            $rtpBit = $hexString.Substring(2, 2); ^
            ^
            if ($rtpBit -eq '10') { $realTimeProtection = 1 }; ^
            ^
            $upToDate = 0; ^
            $updateBit = $hexString.Substring(4, 2); ^
            ^
            if ($updateBit -eq '00') { $upToDate = 1 }; ^
            ^
            return @{ ^
                RealTimeProtection = $realTimeProtection; ^
                UpToDate = $upToDate; ^
            }; ^
        }; ^
        ^
        $avFound = $false; ^
        $avStatus = @{ ^
            DisplayName = '백신 미설치'; ^
            RealTimeProtection = 0; ^
            UpToDate = 0; ^
        }; ^
        ^
        foreach ($av in $thirdPartyAV) { ^
            if ($av.DisplayName -like '*알약*' -or $av.DisplayName -like '*AhnLab*' -or $av.DisplayName -like '*V3*') { ^
                $status = Get-AVStatus $av.ProductState; ^
                $avStatus = @{ ^
                    DisplayName = $av.DisplayName; ^
                    RealTimeProtection = $status.RealTimeProtection; ^
                    UpToDate = $status.UpToDate; ^
                }; ^
                $avFound = $true; ^
                break; ^
            }; ^
        }; ^
        ^
        $packages = @{ ^
            user_id = (Get-ItemProperty -Path 'HKCU:\Environment').nicednb_audit_user_id; ^
            item_type = '백신 상태 확인'; ^
            actual_value = $avStatus; ^
        }; ^
        ^
        $body = ConvertTo-Json $packages -Depth 4; ^
        try { ^
            [void](Invoke-RestMethod ^
            -Method Post ^
            -Uri '%SERVER_URL%/api/validate_check' ^
            -Body $body ^
            -ContentType 'application/json; charset=utf-8') ^
        } catch { ^
            %YELLOW% '[전송 실패] [%MESSAGE%] API 서버 연결 오류'; ^
            exit 1; ^
        };

    if %ERRORLEVEL% EQU 0 (
        rem call :log_message "알약 백신 상태 검사 성공" "PASS"
    ) else (
        rem call :log_message "알약 백신 상태 검사 실패" "FAIL"
    )

    exit /b

:exit_to_borwser
    powershell -Command ^
        Write-Host '감사 결과 페이지를 호출하고 있습니다.'; ^
        %RED% '브라우저가 실행되지 않는다면 운영실에 문의주세요.'; ^
        Start-Process 'C:\Program Files\Google\Chrome\Application\chrome.exe' -ArgumentList '%SERVER_URL%'
        @REM Start-Process 'C:\Program Files\Google\Chrome\Application\chrome.exe' -ArgumentList '"%SERVER_URL%/search?q=test&category=%nicednb_audit_user_id%"'; ^