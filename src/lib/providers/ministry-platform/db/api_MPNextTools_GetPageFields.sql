/****** Object:  StoredProcedure [dbo].[api_MPNextTools_GetPageFields]    Script Date: 04/16/2026 ******/
DROP PROCEDURE IF EXISTS [dbo].[api_MPNextTools_GetPageFields]
GO

/****** Object:  StoredProcedure [dbo].[api_MPNextTools_GetPageFields]    Script Date: 04/16/2026 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- api_MPNextTools_GetPageFields
-- =============================================
-- Description: Returns all page field records for a given Page_ID
-- Last Modified: 04/16/2026
-- Chris Kehayias
-- =============================================
CREATE PROCEDURE [dbo].[api_MPNextTools_GetPageFields]
    @DomainID INT,
    @PageID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT Page_Field_ID, Page_ID, Field_Name, Group_Name, View_Order,
           Required, Hidden, Default_Value, Filter_Clause,
           Depends_On_Field, Field_Label, Writing_Assistant_Enabled
    FROM dp_Page_Fields
    WHERE Page_ID = @PageID
    ORDER BY View_Order

END
GO

-- =============================================
-- SP MetaData Install
-- =============================================
DECLARE @spName NVARCHAR(128) = 'api_MPNextTools_GetPageFields';
DECLARE @spDescription NVARCHAR(500) = 'Returns all page field records for a given Page_ID';

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
