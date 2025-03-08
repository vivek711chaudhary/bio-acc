# Test Twitter Integration PowerShell Script

Write-Host "Testing Twitter Integration..." -ForegroundColor Green

# 1. Test Direct Message
Write-Host "`nTesting Direct Message..." -ForegroundColor Yellow
$dmBody = @{
    direct_message_events = @(
        @{
            message_create = @{
                sender_id = "test_user_id"
                message_data = @{
                    text = "Tell me about BIO/ACC and its relationship with DeSci"
                }
            }
        }
    )
} | ConvertTo-Json

Write-Host "Sending test DM..."
$dmResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/twitter/webhook" -Method Post -Headers @{'Content-Type'='application/json'} -Body $dmBody
Write-Host "DM Response:" -ForegroundColor Cyan
$dmResponse | ConvertTo-Json

# 2. Test Tweet Mention
Write-Host "`nTesting Tweet Mention..." -ForegroundColor Yellow
$tweetBody = @{
    tweet_create_events = @(
        @{
            id_str = "123456789"
            text = "@bioaccbot What are the key principles of BIO/ACC movement?"
            user = @{
                id_str = "test_user_id"
            }
        }
    )
} | ConvertTo-Json

Write-Host "Sending test tweet mention..."
$tweetResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/twitter/webhook" -Method Post -Headers @{'Content-Type'='application/json'} -Body $tweetBody
Write-Host "Tweet Response:" -ForegroundColor Cyan
$tweetResponse | ConvertTo-Json

# 3. Test Scheduled Post
Write-Host "`nTesting Scheduled Post..." -ForegroundColor Yellow
Write-Host "Triggering scheduled post..."
$scheduledResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/twitter/scheduled" -Method Get
Write-Host "Scheduled Post Response:" -ForegroundColor Cyan
$scheduledResponse | ConvertTo-Json

# 4. Test CRC Check
Write-Host "`nTesting CRC Check..." -ForegroundColor Yellow
$crcResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/twitter/webhook?crc_token=test_token" -Method Get
Write-Host "CRC Response:" -ForegroundColor Cyan
$crcResponse | ConvertTo-Json

Write-Host "`nAll tests completed!" -ForegroundColor Green 