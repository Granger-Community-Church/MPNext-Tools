/****** Object:  StoredProcedure [dbo].[api_MPNextTools_GetPages]    Script Date: 04/16/2026 ******/
DROP PROCEDURE IF EXISTS [dbo].[api_MPNextTools_GetPages]
GO

/****** Object:  StoredProcedure [dbo].[api_MPNextTools_GetPages]    Script Date: 04/16/2026 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- api_MPNextTools_GetPages
-- =============================================
-- Description: Returns a simple list of page metadata (Page_ID, Display_Name, Table_Name)
-- Last Modified: 04/16/2026
-- Chris Kehayias
-- =============================================
CREATE PROCEDURE [dbo].[api_MPNextTools_GetPages]
    @DomainID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT Page_ID, Display_Name, Table_Name
    FROM dp_Pages
    ORDER BY Display_Name

END
GO

-- =============================================
-- SP MetaData Install
-- =============================================
DECLARE @spName NVARCHAR(128) = 'api_MPNextTools_GetPages';
DECLARE @spDescription NVARCHAR(500) = 'Returns a simple list of page metadata (Page_ID, Display_Name, Table_Name)';

IF NOT EXISTS (
    SELECT API_Procedure_ID FROM dp_API_Procedures WHERE Procedure_Name = @spName
)
BEGIN
    INSERT INTO dp_API_Procedures (Procedure_Name, Description)
    VALUES (@spName, @spDescription);
END

-- Grant to Administrators Role
DECLARE @AdminRoleID INT = (
    SELECT Role_ID FROM dp_Roles WHERE Role_Name = 'Administrators'
);

IF NOT EXISTS (
    SELECT 1
    FROM dp_Role_API_Procedures RP
    INNER JOIN dp_API_Procedures AP ON AP.API_Procedure_ID = RP.API_Procedure_ID
    WHERE AP.Procedure_Name = @spName AND RP.Role_ID = @AdminRoleID
)
BEGIN
    INSERT INTO dp_Role_API_Procedures (Domain_ID, API_Procedure_ID, Role_ID)
    VALUES (
        1,
        (SELECT API_Procedure_ID FROM dp_API_Procedures WHERE Procedure_Name = @spName),
        @AdminRoleID
    );
END
GO
