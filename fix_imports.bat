off
powershell
-Command
(Get-Content 'src\components\Dashboard.jsx') -replace '@/components/ui/', './ui/' | Set-Content 'src\components\Dashboard.jsx'
powershell
-Command
(Get-Content 'src\components\TournamentDetail.jsx') -replace '@/components/ui/', './ui/' | Set-Content 'src\components\TournamentDetail.jsx'
powershell
-Command
(Get-Content 'src\components\Navbar.jsx') -replace '@/components/ui/', './ui/' | Set-Content 'src\components\Navbar.jsx'
powershell
-Command
(Get-Content 'src\components\PlayerProfile.jsx') -replace '@/components/ui/', './ui/' | Set-Content 'src\components\PlayerProfile.jsx'
powershell
-Command
(Get-Content 'src\components\Register.jsx') -replace '@/components/ui/', './ui/' | Set-Content 'src\components\Register.jsx'
